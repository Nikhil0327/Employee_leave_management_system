import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# Define file path
DATA_FILE = "HR-Employee-Attrition.csv"

def train_leave_model():
    # 1. Load Data
    print("Loading dataset...")
    if not os.path.exists(DATA_FILE):
        print(f"Error: Dataset '{DATA_FILE}' not found.")
        print("Please download 'IBM HR Analytics Employee Attrition' from Kaggle and place it here.")
        return

    df = pd.read_csv(DATA_FILE)

    # 2. Data Preprocessing & Feature Selection
    print("Preprocessing data...")
    # Select requested features + Target
    features = ['Age', 'MonthlyIncome', 'OverTime', 'DistanceFromHome', 'TotalWorkingYears']
    target = 'Attrition'

    # Filter dataset
    X = df[features].copy()
    y = df[target].copy()

    # Convert Categorical 'OverTime' to numeric (Yes=1, No=0)
    X['OverTime'] = X['OverTime'].apply(lambda x: 1 if x == 'Yes' else 0)

    # Convert Target 'Attrition' to numeric (Yes=1, No=0)
    y = y.apply(lambda x: 1 if x == 'Yes' else 0)

    # 3. Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    # 4. Model Training
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42, class_weight="balanced")
    model.fit(X_train, y_train)

    # 5. Accuracy Evaluation
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Low Risk (0)", "High Risk (1)"]))

    # 6. Save Model
    model_filename = 'leave_model.pkl'
    joblib.dump(model, model_filename)
    print(f"Model saved successfully to {model_filename}")

if __name__ == "__main__":
    train_leave_model()
