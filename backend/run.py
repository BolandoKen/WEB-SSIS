from flask import Flask
import os
from dotenv import load_dotenv
from app import create_app
from app.db import init_db

load_dotenv()

app = create_app()

if __name__ == "__main__":
    with app.app_context():
        init_db()
        print("Database tables initialized!")
    
    app.run(debug=(os.getenv("FLASK_ENV") == "development"))