import sys
import pandas as pd

def test(session_id):
    input_data = pd.read_csv(f"./tmp_data/svm_input_{session_id}.csv")
    features = input_data[['mean_x', 'mean_y', 'mean_z', 'RMS_x', 'RMS_y', 'RMS_z']]

    for index, row in features.iterrows():
        input_data.loc[index, 'quality_label'] = 0
        if abs(row['mean_z']) > 3.4 and abs(row['RMS_z']) > 3.4:
            input_data.loc[index, 'quality_label'] = 1
        if abs(row['mean_x']) > 15 and abs(row['RMS_x']) > 15:
            input_data.loc[index, 'quality_label'] = 1

    output_data = input_data[['time', 'longitude_s', 'latitude_s', 'longitude_e', 'latitude_e', 'quality_label']]
    output_data.to_csv(f"./tmp_data/output_{session_id}.csv", index=False)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python svm_predict.py <session_id>")
        sys.exit(1)

    session_id = sys.argv[1]
    test(session_id)
