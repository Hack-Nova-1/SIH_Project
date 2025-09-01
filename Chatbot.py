import random
import joblib
import pandas as pd
from flask import Flask, request, jsonify

# Import our custom analysis function from the other file
from health_insights import analyze_life_expectancy

# --- Initialize Flask App ---
app = Flask(__name__)

# --- Configuration ---
PIPELINE_PATH = 'sih_pipeline.joblib'
DATA_PATHS = {
    "life_expectancy": "Health_Datasets/WHO/Life_Expectancy_Birth.csv"
}

# --- Load ML Model and Data on Startup ---
try:
    pipeline = joblib.load(PIPELINE_PATH)
    model = pipeline['model']
    mlb = pipeline['mlb']
    label_encoder = pipeline['label_encoder']
    info_df = pipeline['info_df']
    print("✅ Machine learning pipeline for symptom prediction loaded successfully!")
except FileNotFoundError:
    print(f"⚠️ WARNING: Could not find '{PIPELINE_PATH}'. Symptom prediction will not work.")
    model = None
except Exception as e:
    print(f"⚠️ WARNING: An error occurred while loading the ML pipeline: {e}")
    model = None

# --- Reusable Functions ---

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
    user_message = data.get("message", "").lower()

    # --- Intent Routing ---

    # 1. Check for life expectancy query
    if 'life expectancy' in user_message:
        results = analyze_life_expectancy(DATA_PATHS["life_expectancy"])
        if results:
            response = {
                'type': 'health_insight',
                'text': (
                    f"Based on data from {results['latest_year']}, life expectancy for females "
                    f"in India is {results['female_le']} years and for males is {results['male_le']} years."
                ),
                'chart_data_url': f"data:image/png;base64,{results['chart_base64']}"
            }
        else:
            response = {"error": "Could not retrieve life expectancy data."}
        return jsonify(response)

    # 2. Check for symptoms (comma-separated list)
    elif ',' in user_message and model:
        symptoms = [s.strip() for s in user_message.split(',')]
        response = predict_from_symptoms(symptoms)
        return jsonify(response)
        
    # 3. Fallback for everything else
    else:
        fallback_responses = [
            "Hello! I am a health awareness chatbot. Ask me about 'life expectancy' or provide comma-separated symptoms (e.g., 'itching, skin rash') for a prediction.",
            "I can provide health insights or predict a disease from symptoms. What would you like to know?",
            "You can ask me a health question, or list some symptoms separated by commas."
        ]
        response = {'type': 'greeting', 'text': random.choice(fallback_responses)}
        return jsonify(response)

# --- Root Endpoint for Health Check ---
@app.route('/')
def index():
    return "SIH Health Chatbot Backend is running!"

# --- Run the App ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)