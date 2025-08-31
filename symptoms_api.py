from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Symptom Logger & Recommendation API")

# Data models
class SymptomLog(BaseModel):
    user_id: str
    symptoms: List[str]

class RecommendationResponse(BaseModel):
    recommendations: List[str]

# In-memory storage
SYMPTOM_STORAGE: Dict[str, List[str]] = {}

# Simple recommendation rules
RECOMMENDATION_MAP = {
    "fever": "Stay hydrated and rest. Consult a doctor if fever persists.",
    "cough": "Drink warm fluids and consider a humidifier.",
    "headache": "Rest in a quiet, dark room and stay hydrated.",
    "sore throat": "Gargle with salt water and use lozenges.",
}

@app.post("/symptoms", summary="Log symptoms for a user")
def log_symptoms(log: SymptomLog):
    SYMPTOM_STORAGE[log.user_id] = log.symptoms
    return {"message": "Symptoms logged successfully."}

@app.get("/recommendations/{user_id}", response_model=RecommendationResponse, summary="Get recommendations for logged symptoms")
def get_recommendations(user_id: str):
    symptoms = SYMPTOM_STORAGE.get(user_id)
    if symptoms is None:
        raise HTTPException(status_code=404, detail="No symptoms found for user.")
    recommendations = []
    for symptom in symptoms:
        recommendation = RECOMMENDATION_MAP.get(symptom.lower(), "No specific recommendation. Consult a medical professional.")
        recommendations.append(f"{symptom}: {recommendation}")
    return RecommendationResponse(recommendations=recommendations)
