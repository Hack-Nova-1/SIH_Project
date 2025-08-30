"""
Simple loader and predictor for the SIH disease chatbot pipeline.
- Loads 'sih_pipeline.joblib' produced by the notebook
- Exposes `predict_from_symptoms(symptoms: List[str]) -> dict` returning disease, description, precautions
- Can be run from CLI with symptoms as comma-separated string
"""
from typing import List
import argparse
import joblib
import pandas as pd

PIPELINE_PATH = 'sih_pipeline.joblib'

def load_pipeline(path: str = PIPELINE_PATH):
    data = joblib.load(path)
    return data['model'], data['mlb'], data['label_encoder'], data['info_df']


def predict_from_symptoms(symptoms: List[str], model, mlb, label_encoder, info_df: pd.DataFrame) -> dict:
    """Return structured chatbot response for input symptoms list."""
    # ensure cleaned input
    cleaned = [s.strip().replace('_', ' ') for s in symptoms if s and s.strip()]
    binary_input = mlb.transform([cleaned])
    input_df = pd.DataFrame(binary_input, columns=mlb.classes_)
    pred = model.predict(input_df)
    disease = label_encoder.inverse_transform(pred)[0]
    if disease in info_df.index:
        info = info_df.loc[disease]
        description = info['Description'] if 'Description' in info else 'Description not available.'
        precautions = [p for p in info[['Precaution_1','Precaution_2','Precaution_3','Precaution_4']] if pd.notna(p)]
    else:
        description = 'Description not available.'
        precautions = []
    return {
        'predicted_disease': disease,
        'description': description,
        'precautions': precautions
    }


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Serve SIH disease prediction model from saved pipeline')
    parser.add_argument('--symptoms', type=str, required=True, help='Comma-separated list of symptoms (e.g. "fever,cough")')
    parser.add_argument('--pipeline', type=str, default=PIPELINE_PATH, help='Path to saved pipeline joblib')
    args = parser.parse_args()

    model, mlb, label_encoder, info_df = load_pipeline(args.pipeline)
    symptoms = [s.strip() for s in args.symptoms.split(',') if s.strip()]
    resp = predict_from_symptoms(symptoms, model, mlb, label_encoder, info_df)
    print('--- Chatbot Response ---')
    print(f"Predicted Disease: {resp['predicted_disease']}")
    print(f"Description: {resp['description']}")
    print('Recommended Precautions:', ', '.join(resp['precautions']))
