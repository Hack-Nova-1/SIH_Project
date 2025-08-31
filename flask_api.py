from flask import Flask, request, jsonify, Response
from health_insights import analyze_life_expectancy

app = Flask(__name__)

# --- Define File Paths for Datasets ---
DATA_PATHS = {
    "life_expectancy": "Health_Datasets/WHO/Life_Expectancy_Birth.csv"
}

def handle_user_query(query):
    """
    Processes user query and prepares chatbot-like response
    """

    if "life expectancy" in query.lower():
        print("Fetching life expectancy data for India...")
        results = analyze_life_expectancy(DATA_PATHS["life_expectancy"])

        if results:
            year = results['latest_year']
            female_le = results['female_le']
            male_le = results['male_le']

            response_text = (
                f"Based on the latest data from {year}, "
                f"the life expectancy for females in India is {female_le} years, "
                f"and for males, it is {male_le} years."
            )

            return {"text": response_text}
        else:
            return {"text": "I'm sorry, I couldn't retrieve the life expectancy data."}

    else:
        return {"text": "I can't answer that yet. Please ask me about 'life expectancy'."}


# --- Flask Routes ---
@app.route("/chat", methods=["POST"])
def chat():
    """
    Endpoint for chatbot queries
    Example: { "query": "Tell me about life expectancy in India" }
    """
    data = request.get_json()
    user_query = data.get("query", "")

    response = handle_user_query(user_query)
    return jsonify(response)


# --- NEW: Plain Text GET Route ---
@app.route("/life-expectancy", methods=["GET"])
def get_life_expectancy():
    """
    Simple GET endpoint to fetch India's latest life expectancy
    Returns plain text (not JSON)
    """
    results = analyze_life_expectancy(DATA_PATHS["life_expectancy"])
    if results:
        year = results['latest_year']
        female_le = results['female_le']
        male_le = results['male_le']

        response_text = (
            f"Based on the latest data from {year}, "
            f"the life expectancy for females in India is {female_le} years, "
            f"and for males, it is {male_le} years."
        )

        return Response(response_text, mimetype="text/plain")

    else:
        return Response("I'm sorry, I couldn't retrieve the life expectancy data.", mimetype="text/plain")


if __name__ == "__main__":
    app.run(debug=True)
