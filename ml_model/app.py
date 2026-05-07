from flask import Flask, request, jsonify
import joblib
import pandas as pd
import os

app = Flask(__name__)

# Load the trained model
MODEL_FILE = "leave_model.pkl"
if os.path.exists(MODEL_FILE):
    model = joblib.load(MODEL_FILE)
else:
    model = None
    print(f"Warning: {MODEL_FILE} not found. Please train the model first.")

@app.route('/predict', methods=['POST'])
def predict_leave_risk():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # 1. Parse Input JSON
        data = request.get_json()

        # Expected parameters matching feature selection
        age = int(data.get("age", 0))
        salary = int(data.get("salary", 0))
        overtime = int(data.get("overtime", 0))  # Expected as 1 or 0
        distance = int(data.get("distance", 0))
        experience = int(data.get("experience", 0))

        # 2. Prepare Dataframe (must match training feature names)
        input_data = pd.DataFrame([{
            'Age': age,
            'MonthlyIncome': salary,
            'OverTime': overtime,
            'DistanceFromHome': distance,
            'TotalWorkingYears': experience
        }])

        # 3. Model Prediction
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1] # Probability for class 1 (High Risk)

        # 4. Formulate Response
        response = {
            "prediction": int(prediction),
            "risk": "High" if prediction == 1 else "Low",
            "probability": round(float(probability), 4)
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
