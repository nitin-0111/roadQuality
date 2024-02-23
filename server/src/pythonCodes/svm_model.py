import sys
import pandas as pd
from joblib import load

def predict_output(session_id):
    # Load the serialized SVM model
    svm_model = load('svm_model.sav')

    # Read input CSV file into a DataFrame
    input_data = pd.read_csv(f"./tmp_data/svm_input_{session_id}.csv")

    # Extract features for prediction
    features = input_data[['mean_x', 'mean_y', 'mean_z', 'RMS_x', 'RMS_y', 'RMS_z']]

    # Predict using the SVM model
    predicted_output = svm_model.predict(features)

    # Add predicted output to input DataFrame
    input_data['predicted_output'] = predicted_output

    # Save the DataFrame with predicted output to output CSV file
    output_data = input_data[['time', 'longitude_s', 'latitude_s', 'longitude_e', 'latitude_e','predicted_output']]
    output_data.to_csv(f"./tmp_data/output_{session_id}.csv", index=False)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python svm_predict.py <session_id>")
        sys.exit(1)

    session_id = sys.argv[1]
    predict_output(session_id)
