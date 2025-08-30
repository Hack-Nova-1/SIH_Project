# app.py
# This will be the main application file for your chatbot.

# Import the functions from our new library
from health_insights import analyze_life_expectancy

# --- Define File Paths for Datasets ---

DATA_PATHS = {
    "life_expectancy": "Health_Datasets/WHO/Life_Expectancy_Birth.csv"
    # We will add other paths here as we go
}

def handle_user_query(query):
    """
    Simulates the chatbot handling a user's request and preparing
    a response for a web frontend.
    """

    if "life expectancy" in query.lower():
        print("Fetching life expectancy data for India...")
        # Call your reusable function to get the analysis
        results = analyze_life_expectancy(DATA_PATHS["life_expectancy"])

        if results:
            # Format the results into a chatbot response
            year = results['latest_year']
            female_le = results['female_le']
            male_le = results['male_le']
        
            # Now, use this data and chart to answer the user
            response = (
                f"Based on the latest data from {year}, the life expectancy for females in India is {female_le} years, "
                f"and for males, it is {male_le} years. You can view a detailed chart of this trend."
            )

            web_response = {
                "text": response,
                "image_data_url": f"data:image/png;base64,{results['chart_base64']}"
            }

            print("\n--- SIMULATING CHATBOT RESPONSE ---")
            print(f"Text: {web_response['text']}")
            print("\n--- FOR YOUR WEB DEVELOPER ---")
            print("The web frontend would receive the following data URL.")
            print("Create a link like this: <a href='...' target='_blank'>View Chart</a>")
            print(f"Data URL (first 50 chars): {web_response['image_data_url'][:50]}...")

        else:
            print("\nCHATBOT: I'm sorry, I couldn't retrieve the life expectancy data.")

    else:
        print("\nCHATBOT: I can't answer that yet. Please ask me about 'life expectancy'.")


# --- main chatbot logic would start here ---
if __name__ == "__main__":
    # Simulate a user asking a question
    user_input = "Tell me about life expectancy in India."
    handle_user_query(user_input)