import random
import json
import csv
from flask import Flask, request, jsonify

app = Flask(__name__)

# --- Configuration ---
USE_AI_MODEL = False  # Set to True to use AI model (OpenAI, Gemini, etc.)
AI_API_KEY = None     # Put your API key here when ready

# --- Knowledge base: dictionary of disease info (default) ---
KNOWLEDGE_BASE = {
    "malaria": "Malaria is a mosquito-borne disease. Symptoms include fever, chills, and headache. Prevention includes mosquito nets and antimalarial medicines.",
    "flu": "Influenza (flu) is a viral illness causing fever, cough, sore throat, and fatigue. Annual vaccination helps prevent the flu.",
    "covid": "COVID-19 is a respiratory illness caused by coronavirus. Main symptoms are fever, cough, and difficulty breathing. Prevention includes vaccination, masks, and hand-washing.",
    "cholera": "Cholera is an acute diarrheal illness caused by infection of the intestine with Vibrio cholerae bacteria. Prevention includes clean water and sanitation."
    # Add more diseases and information here
}

RANDOM_RESPONSES = [
    "Remember to wash your hands regularly to prevent disease.",
    "Staying hydrated helps your immune system.",
    "Vaccination is a key step in disease prevention.",
    "Eat a balanced diet for good health.",
    "Regular exercise boosts your overall wellness.",
    "If you feel unwell, consult a healthcare professional.",
    "Maintain proper hygiene to reduce disease transmission.",
    "Get enough sleep for a stronger immune system.",
    "Avoid close contact with sick individuals.",
    "Stay informed about local health guidelines."
]

def get_knowledge_base_reply(message):
    lower_message = message.lower()
    for disease in KNOWLEDGE_BASE:
        if disease in lower_message:
            return KNOWLEDGE_BASE[disease]
    return None

# --- Option to load knowledge base from JSON or CSV ---
def load_knowledge_base_json(filepath):
    global KNOWLEDGE_BASE
    with open(filepath, 'r', encoding='utf-8') as f:
        KNOWLEDGE_BASE = json.load(f)

def load_knowledge_base_csv(filepath):
    global KNOWLEDGE_BASE
    new_kb = {}
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            disease = row.get('disease', '').lower()
            info = row.get('info', '')
            if disease:
                new_kb[disease] = info
    KNOWLEDGE_BASE = new_kb

# Example: Uncomment one of the lines below to load a file at startup
# load_knowledge_base_json('knowledge_base.json')
# load_knowledge_base_csv('knowledge_base.csv')

# --- Placeholder for AI Model integration ---
def get_ai_model_reply(message):
    # You will add your AI API logic here (OpenAI, Gemini, etc.)
    # Example for OpenAI:
    # import openai
    # openai.api_key = AI_API_KEY
    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     messages=[{"role": "user", "content": message}]
    # )
    # return response['choices'][0]['message']['content']
    # For now, just return a placeholder response
    return "AI model integration is not enabled yet. Please provide your API key and set USE_AI_MODEL = True."

@app.route("/chat", methods=["POST"])
def chat():
    req = request.get_json()
    user_message = req.get("message", "")

    if USE_AI_MODEL and AI_API_KEY:
        reply = get_ai_model_reply(user_message)
    else:
        kb_reply = get_knowledge_base_reply(user_message)
        if kb_reply:
            reply = kb_reply
        else:
            reply = random.choice(RANDOM_RESPONSES)
    return jsonify({"reply": reply})

@app.route("/", methods=["GET"])
def index():
    return (
        "Public Health Chatbot backend is running with a knowledge base. "
        "You can load knowledge from CSV or JSON, and enable AI integration when ready."
    )

@app.route("/random-fact", methods=["GET"])
def random_fact():
    facts = [
        "Drinking water can boost your energy levels.",
        "Regular exercise improves mental health.",
        "Washing hands reduces the spread of disease.",
        "Getting enough sleep is vital for your immune system.",
        "Eating fruits and vegetables supports overall health."
    ]
    return jsonify({"fact": random.choice(facts)})
if __name__ == "__main__":
    app.run(debug=True)