from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_step
import os
import base64
from tempfile import mkdtemp

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def test():
    return jsonify("Hello!")

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        if 'image' not in request.json:
            return jsonify({'error': 'No image data provided in the request'}), 400
        
        image_data_base64 = request.json['image']
        image_data = base64.b64decode(image_data_base64)
        
        temp_dir = mkdtemp()
        temp_file_path = os.path.join(temp_dir, 'image.jpg')
        with open(temp_file_path, 'wb') as f:
            f.write(image_data)
        
        predictions = predict_step([temp_file_path])
        
        os.remove(temp_file_path)
        os.rmdir(temp_dir)
        
        return jsonify({'predictions': predictions}), 200

if __name__ == '__main__':
    app.run(debug=True)
