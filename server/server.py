from flask import Flask, request, jsonify
import util

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    return response

@app.route('/classify_image', methods = ['GET','POST','OPTIONS'])
def classify_image():
    if request.method == 'OPTIONS':
        return ('', 204)

    image_data = request.form.get('image_data')
    if not image_data:
        return jsonify({'error': 'image_data is required'}), 400

    response = jsonify(util.classify_image(image_data))
    return response

@app.route('/class_dictionary', methods = ['GET','OPTIONS'])
def class_dictionary():
    if request.method == 'OPTIONS':
        return ('', 204)

    response = jsonify(util.get_class_dictionary())
    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Women Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)
