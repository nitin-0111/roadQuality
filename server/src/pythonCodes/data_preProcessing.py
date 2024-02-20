

# Read input data from CSV file
input_data = pd.read_csv('/content/drive/MyDrive/Result/trip_with_quality_label.csv')

# Extract ax, ay, az from input data
ax = input_data['x']
ay = input_data['y']
az = input_data['z']

# Calculate alpha and beta
alpha = np.arctan2(ay, np.sqrt(ax**2 + az**2))
beta = np.arctan2(-ax, np.sqrt(ay**2 + az**2))

# Perform operations
ax_prime = np.cos(beta) * ax + np.sin(beta) * np.sin(alpha) * ay + np.cos(alpha) * np.sin(beta) * az
ay_prime = np.cos(alpha) * ay - np.sin(alpha) * az
az_prime = -np.sin(beta) * ax + np.cos(beta) * np.sin(alpha) * ay + np.cos(alpha) * np.cos(beta) * az

# Add new columns to the existing DataFrame
input_data['ax_prime'] = ax_prime
input_data['ay_prime'] = ay_prime
input_data['az_prime'] = az_prime




# Load trip.csv
trip_data =input

# Create an empty DataFrame to store segment data
segments = pd.DataFrame(columns=['time', 'longitude', 'latitude',  'mean_x', 'mean_y', 'mean_z', 'RMS_x', 'RMS_y', 'RMS_z'])

# Define function to calculate RMS
def calculate_RMS(arr):
    return np.sqrt(np.mean(np.square(arr)))

# Calculate segment-wise data
segment_size = 100
overlap = 50

for i in range(0, len(trip_data), segment_size - overlap):
    segment = trip_data.iloc[i:i + segment_size]
    if len(segment) < segment_size:
        break

    segment_data = {
        'time': segment['time'].iloc[0],
         'longitude_s': segment['longitude'].iloc[0],
        'latitude_s': segment['latitude'].iloc[0],
        'longitude_e': segment['longitude'].iloc[-1],
        'latitude_e': segment['latitude'].iloc[-1],
       
        'mean_x': segment['ax_prime'].abs().mean(),
        'mean_y': segment['ay_prime'].abs().mean(),
        'mean_z': segment['az_prime'].abs().mean(),
        'RMS_x': calculate_RMS(segment['ax_prime']),
        'RMS_y': calculate_RMS(segment['ay_prime']),
        'RMS_z': calculate_RMS(segment['az_prime'])
    }

    segments = segments.append(segment_data, ignore_index=True)

# Save segment data to segment.csv
segments.to_csv('/content/drive/MyDrive/Result/segment_Jiomart.csv', index=False)
#segments.to_csv('/content/drive/MyDrive/Final_Data_set/Privous_End-jio-mart/segment.csv', index=False)