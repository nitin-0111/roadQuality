import pandas as pd
import numpy as np
import sys


def calculate_RMS(arr):
    return np.sqrt(np.mean(np.square(arr)))


def main():
    if len(sys.argv) < 2:
        print("Please provide sessionId as a command line argument.")
        return

    sessionId = sys.argv[1]

    try:
        acceleration = pd.read_csv(f"./tmp_data/accelerometer_{sessionId}.csv")
        location = pd.read_csv(f"./tmp_data/location_{sessionId}.csv")
    except FileNotFoundError:
        print("One or both CSV files not found.")
        return

    merged_data = pd.merge(acceleration, location, on='time_sec', how='left')

    # Fill missing values using forward and backward fill
    merged_data[['altitude', 'longitude', 'latitude']] = merged_data[['altitude', 'longitude', 'latitude']].ffill().bfill()

    trip_1 = merged_data[['time_acc', 'z', 'x', 'y', 'altitude', 'longitude', 'latitude']]

    # Calculate alpha and beta
    alpha = np.arctan2(trip_1['y'], np.sqrt(trip_1['x']**2 + trip_1['z']**2))
    beta = np.arctan2(-trip_1['x'], np.sqrt(trip_1['y']**2 + trip_1['z']**2))

    # Calculate ax', ay', az'
    ax_prime = np.cos(beta) * trip_1['x'] + np.sin(beta) * np.sin(alpha) * trip_1['y'] + np.cos(alpha) * np.sin(beta) * trip_1['z']
    ay_prime = np.cos(alpha) * trip_1['y'] - np.sin(alpha) * trip_1['z']
    az_prime = -np.sin(beta) * trip_1['x'] + np.cos(beta) * np.sin(alpha) * trip_1['y'] + np.cos(alpha) * np.cos(beta) * trip_1['z']

    # Assign ax', ay', az' to trip_1 DataFrame
    trip_1['ax'] = ax_prime
    trip_1['ay'] = ay_prime
    trip_1['az'] = az_prime

    segment_size = 20
    overlap = 5
    segments = []

    # Segment the data
    for i in range(0, len(trip_1), segment_size - overlap):
        segment = trip_1.iloc[i:i + segment_size]
        if len(segment) < segment_size:
            break

        segment_data = {
            'time': segment['time_acc'].iloc[0],
            'longitude_s': segment['longitude'].iloc[0],
            'latitude_s': segment['latitude'].iloc[0],
            'longitude_e': segment['longitude'].iloc[-1],
            'latitude_e': segment['latitude'].iloc[-1],
            'mean_x': segment['ax'].abs().mean(),
            'mean_y': segment['ay'].abs().mean(),
            'mean_z': segment['az'].abs().mean(),
            'RMS_x': calculate_RMS(segment['ax']),
            'RMS_y': calculate_RMS(segment['ay']),
            'RMS_z': calculate_RMS(segment['az'])
        }

        segments.append(segment_data)

    # Create DataFrame from segments and save to CSV
    segments_df = pd.DataFrame(segments)
    segments_df.to_csv(f"./tmp_data/svm_input_{sessionId}.csv", index=False)


if __name__ == "__main__":
    main()
