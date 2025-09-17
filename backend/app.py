from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React frontend to call Flask

@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask!")

# 👇 This part actually starts the Flask server
if __name__ == "__main__":
    app.run(debug=True)
 