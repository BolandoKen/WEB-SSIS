from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

secret_key = os.getenv("SECRET_KEY")
if not secret_key:
    raise RuntimeError("SECRET_KEY is not set. Please add it to your .env file.")
app.secret_key = secret_key

@app.route("/")
def home():
    return "Flask app running with secret key and DB from .env!"

if __name__ == "__main__":
    app.run(debug=(os.getenv("FLASK_ENV") == "development"))
