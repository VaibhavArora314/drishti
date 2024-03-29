from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_step
import os
import base64
from tempfile import mkdtemp

app = Flask(__name__)
CORS(app)  # Add CORS support to all routes

@app.route('/', methods=['GET'])
def test():
    return jsonify("Hello!")

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        # Check if the request contains image data in base64 format
        if 'image' not in request.json:
            return jsonify({'error': 'No image data provided in the request'}), 400
        
        image_data_base64 = request.json['image']
        
        # Convert base64 string to bytes
        image_data = base64.b64decode(image_data_base64)
        
        # Create a temporary directory to store the image
        temp_dir = mkdtemp()
        
        # Save the image to the temporary directory
        temp_file_path = os.path.join(temp_dir, 'image.jpg')
        with open(temp_file_path, 'wb') as f:
            f.write(image_data)
        
        # Call the predict_step function with the image path
        predictions = predict_step([temp_file_path])
        
        # Clean up: delete the temporary file and directory
        os.remove(temp_file_path)
        os.rmdir(temp_dir)
        
        return jsonify({'predictions': predictions}), 200

if __name__ == '__main__':
    app.run(debug=True)
