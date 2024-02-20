import pandas as pd
import numpy as np
import sys

def main():
    # Extract sessionId from command line arguments
    sessionId = sys.argv[1]

    # Load the CSV files
    acceleration = pd.read_csv(f"./tmp_data/accelerometer_{sessionId}.csv")
    location = pd.read_csv(f"./tmp_data/location_{sessionId}.csv")

    # Merge the dataframes on 'time' column
    merged_data = pd.merge_asof(acceleration.sort_values('time'), location.sort_values('time'), on='time')

    # Forward fill missing values in location columns
    merged_data[['altitude', 'longitude', 'latitude']] = merged_data[['altitude', 'longitude', 'latitude']].fillna(method='ffill')
    merged_data[['altitude', 'longitude', 'latitude']] = merged_data[['altitude', 'longitude', 'latitude']].fillna(method='bfill')

    # Create a new dataframe with the required columns
    trip_1 = merged_data[['time', 'z', 'x', 'y', 'altitude', 'longitude', 'latitude']]

    # Calculate alpha and beta
    ax, ay, az = trip_1['x'], trip_1['y'], trip_1['z']
    alpha = np.arctan2(ay, np.sqrt(ax**2 + az**2))
    beta = np.arctan2(-ax, np.sqrt(ay**2 + az**2))

    # Perform operations
    ax_prime = np.cos(beta) * ax + np.sin(beta) * np.sin(alpha) * ay + np.cos(alpha) * np.sin(beta) * az
    ay_prime = np.cos(alpha) * ay - np.sin(alpha) * az
    az_prime = -np.sin(beta) * ax + np.cos(beta) * np.sin(alpha) * ay + np.cos(alpha) * np.cos(beta) * az

    # Add new columns to the existing DataFrame
    trip_1['ax'] = ax_prime
    trip_1['ay'] = ay_prime
    trip_1['az'] = az_prime

    # Save updated data to the existing CSV file
    # trip_1.to_csv(f"../tmp_data/merge_And_preprocessed_{sessionId}.csv", index=False)

    # Calculate segment-wise data
    segment_size = 2
    overlap = 1
    segments = pd.DataFrame(columns=['time', 'longitude', 'latitude', 'mean_x', 'mean_y', 'mean_z', 'RMS_x', 'RMS_y', 'RMS_z'])

    for i in range(0, len(trip_1), segment_size - overlap):
        segment = trip_1.iloc[i:i + segment_size]
        if len(segment) < segment_size:
            break

        segment_data = {
            'time': segment['time'].iloc[0],
            'longitude': segment['longitude'].iloc[0],
            'latitude': segment['latitude'].iloc[0],
            'mean_x': segment['ax'].abs().mean(),
            'mean_y': segment['ay'].abs().mean(),
            'mean_z': segment['az'].abs().mean(),
            'RMS_x': np.sqrt(np.mean(np.square(segment['ax']))),
            'RMS_y': np.sqrt(np.mean(np.square(segment['ay']))),
            'RMS_z': np.sqrt(np.mean(np.square(segment['az'])))
        }

        segments = segments.append(segment_data, ignore_index=True)

    # Save segment data to segment.csv
    segments.to_csv(f"./tmp_data/svm_input_{sessionId}.csv", index=False)


if __name__ == "__main__":
    main()
