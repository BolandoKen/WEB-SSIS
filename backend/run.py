from app import create_app
from app.db import init_db

app = create_app()

if __name__ == "__main__":
    # Initialize database tables before running the app
    with app.app_context():
        init_db()
        print("Database tables initialized!")
    
    app.run(debug=True)