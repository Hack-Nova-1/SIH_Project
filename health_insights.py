# health_insights.py
# This file will contain all functions related to analyzing health datasets.

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

def analyze_life_expectancy(file_path):
    """
    Analyzes life expectancy data for India and returns key stats
    and a Base64 encoded image of the trend chart.
    """
    
    try:
        df = pd.read_csv(file_path)
        india_df = df[df["GEO_NAME_SHORT"] == "India"]

        if india_df.empty:
            print("Error: No data found for 'India' in the file.")
            return None
        
        # --- Visualization ---
        df_plot = india_df[india_df['DIM_SEX'] != 'TOTAL'].copy()
        
        sns.set_style("whitegrid")
        plt.figure(figsize=(14, 7))
        sns.lineplot(data=df_plot, x='DIM_TIME', y='AMOUNT_N', hue='DIM_SEX', marker='o')

        plt.title('Life Expectancy at Birth in India (2000-2021)', fontsize=16)
        plt.xlabel('Year', fontsize=12)
        plt.ylabel('Life Expectancy (in years)', fontsize=12)
        plt.legend(title='Sex')
        plt.grid(True)
        plt.tight_layout()

        # --- Save plot to an in-memory buffer ---
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)

        # --- Encode the image to a Base64 string ---
        image_base64 = base64.b64encode(buf.read()).decode('utf-8')
        plt.close()

        # --- Extracting Key Statistics ---
        latest_year = india_df['DIM_TIME'].max()
        latest__data = india_df[india_df['DIM_TIME'] == latest_year]
        male_le = latest__data[latest__data['DIM_SEX'] == 'MALE']['AMOUNT_N'].iloc[0]
        female_le = latest__data[latest__data['DIM_SEX'] == 'FEMALE']['AMOUNT_N'].iloc[0]

        return {
            'latest_year': int(latest_year),
            'female_le': round(female_le, 2),
            'male_le': round(male_le, 2),
            'chart_base64': image_base64  # Return the string instead of a filename
        }
    
    except FileNotFoundError:
        print(f"Error: The file was not found at {file_path}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
    
