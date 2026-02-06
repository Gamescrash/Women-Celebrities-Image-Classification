from crypt import methods
from flask import Flask, request, jsonify
from numpy import imag
from werkzeug.wrappers import response
import util

app = Flask(__name__)

@app.route('/classify_image', methods = ['GET','POST'])
def classify_image():
    image_data = request.form['image_data']

    response = jsonify(util.classify_image(image_data))

    response.headers.add('Acccess-Control-Allow-Origin','*')

    return response


if __name__ == "__main__":
    print("Starting Python Flask Server For Women Celebrity Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)