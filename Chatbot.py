import random
import joblib
import pandas as pd
from flask import Flask, request, jsonify
from deep_translator import GoogleTranslator
from gtts import gTTS
import base64
import io

# Import our custom analysis function from the other file
from health_insights import analyze_life_expectancy

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Configuration ---
PIPELINE_PATH = 'sih_pipeline.joblib'
DATA_PATHS = {
    "life_expectancy": "Health_Dataset/WHO/Life_Expectancy_Birth.csv"
}

# --- Load ML Model and Data on Startup ---
try:
    pipeline = joblib.load(PIPELINE_PATH)
    model = pipeline['model']
    mlb = pipeline['mlb']
    label_encoder = pipeline['label_encoder']
    info_df = pipeline['info_df']
    print("Machine learning pipeline for symptom prediction loaded successfully!")
except FileNotFoundError:
    print(f"WARNING: Could not find '{PIPELINE_PATH}'. Symptom prediction will not work.")
    model = None
except Exception as e:
    print(f"WARNING: An error occurred while loading the ML pipeline: {e}")
    model = None

# --- Reusable Functions ---

def translate_text(text, dest_lang='en'):
    try:
        if dest_lang == 'en':
            return text  # No need to translate if already English
        else:
            return GoogleTranslator(source='en', target=dest_lang).translate(text)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def text_to_speech(text, lang='en'):
    try:
        tts = gTTS(text=text, lang=lang)
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        audio_base64 = base64.b64encode(fp.read()).decode('utf-8')
        return audio_base64
    except Exception as e:
        print(f"TTS error: {e}")
        return None

def predict_from_symptoms(symptoms: list) -> dict:
    """Predicts disease from a list of symptoms using the loaded model."""
    if not model:
        return {"error": "Machine learning model is not available."}

    cleaned_symptoms = [s.strip().replace('_', ' ') for s in symptoms if s and s.strip()]
    
    try:
        binary_input = mlb.transform([cleaned_symptoms])
        input_df = pd.DataFrame(binary_input, columns=mlb.classes_)
        prediction = model.predict(input_df)
        disease = label_encoder.inverse_transform(prediction)[0]

        if disease in info_df.index:
            info = info_df.loc[disease]
            description = info.get('Description', 'No description available.')
            precautions = [p for p in info[['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']] if pd.notna(p)]
        else:
            description, precautions = "No description available.", []

        return {
            'type': 'disease_prediction',
            'predicted_disease': disease,
            'description': description,
            'precautions': precautions
        }
    except Exception as e:
        return {"error": f"Prediction failed. Some symptoms may not be recognized. Details: {e}"}

# --- Main Chat Endpoint ---
@app.route('/chat', methods=['POST'])
def chat():
    """Main endpoint to handle all chatbot communication."""
    data = request.get_json()
    user_message = data.get("message", "")
    user_lang = data.get("language", "en")
    voice = data.get("voice", False)

    # Translate user message to English for processing
    translated_message = translate_text(user_message, dest_lang='en').lower()

    # --- Intent Routing ---

    # 1. Check for life expectancy query
    if 'life expectancy' in translated_message:
        results = analyze_life_expectancy(DATA_PATHS["life_expectancy"])
        if results:
            response_text = (
                f"Based on data from {results['latest_year']}, life expectancy for females "
                f"in India is {results['female_le']} years and for males is {results['male_le']} years."
            )
            response = {
                'type': 'health_insight',
                'text': response_text,
                'chart_data_url': f"data:image/png;base64,{results['chart_base64']}"
            }
        else:
            response = {"error": "Could not retrieve life expectancy data."}
    # 2. Check for symptoms (comma-separated list)
    elif ',' in translated_message and model:
        symptoms = [s.strip() for s in translated_message.split(',')]
        prediction = predict_from_symptoms(symptoms)
        if 'error' in prediction:
            response = prediction
        else:
            # Translate description and precautions back to user language
            description = translate_text(prediction['description'], dest_lang=user_lang)
            precautions = [translate_text(p, dest_lang=user_lang) for p in prediction['precautions']]
            response = {
                'type': 'disease_prediction',
                'predicted_disease': prediction['predicted_disease'],
                'description': description,
                'precautions': precautions
            }
    # 3. Fallback for everything else
    else:
        fallback_responses = [
            "Hello! I am a health awareness chatbot. Ask me about 'life expectancy' or provide comma-separated symptoms (e.g., 'itching, skin rash') for a prediction.",
            "I can provide health insights or predict a disease from symptoms. What would you like to know?",
            "You can ask me a health question, or list some symptoms separated by commas."
        ]
        response_text = random.choice(fallback_responses)
        response = {'type': 'greeting', 'text': response_text}

    # If voice is requested, convert response text to speech
    if voice and 'text' in response:
        audio_base64 = text_to_speech(response['text'], lang=user_lang)
        if audio_base64:
            response['audio_base64'] = audio_base64

    return jsonify(response)

# --- Root Endpoint for Health Check ---
@app.route('/')
def index():
    return "SIH Health Chatbot Backend is running!"

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
