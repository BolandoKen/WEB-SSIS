from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import traceback

# Create Flask app first
app = Flask(__name__)
CORS(app)  # allow React frontend

# PostgreSQL config
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:pointbreak@localhost:5432/webssis'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the app
db = SQLAlchemy(app)

# User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# Test database connection
@app.route("/api/hello")
def hello():
    try:
        # Test database connection
        with app.app_context():
            db.session.execute(db.text('SELECT 1'))
            return jsonify(message="Hello from Flask! Database connected.")
    except Exception as e:
        print(f"Database test failed: {e}")
        return jsonify(message=f"Hello from Flask! Database error: {str(e)}"), 500

# Signup route
@app.route("/api/signup", methods=["POST"])
def signup():
    print("🔵 Signup endpoint hit")
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not username or not email or not password:
            print("❌ Missing required fields")
            return jsonify({"error": "Fill in all fields"}), 400

        print(f"Checking if user exists: {username}, {email}")
        
        # Check if user already exists
        with app.app_context():
            existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
            if existing_user:
                print(f"❌ User already exists: {existing_user}")
                return jsonify({"error": "Username or email already exists"}), 400

            print("Hashing password...")
            # Hash the password
            hashed_pw = generate_password_hash(password)

            print("Creating new user...")
            # Create new user
            user = User(username=username, email=email, password_hash=hashed_pw)
            db.session.add(user)
            db.session.commit()
        
        print(f"✅ User created successfully: {username}")
        return jsonify({"message": f"Account created for {username}"}), 201

    except Exception as e:
        print(f"❌ Signup error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        with app.app_context():
            db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Login route
@app.route("/api/login", methods=["POST"])
def login():
    print("🔵 Login endpoint hit")
    try:
        data = request.get_json()
        print(f"Received login data: {data}")
        
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            print("❌ Missing email or password")
            return jsonify({"error": "Email and password required"}), 400

        print(f"Looking for user with email: {email}")
        with app.app_context():
            user = User.query.filter_by(email=email).first()
        
        if not user:
            print("❌ User not found")
            return jsonify({"error": "Invalid credentials"}), 401
            
        print("Checking password...")
        if not check_password_hash(user.password_hash, password):
            print("❌ Invalid password")
            return jsonify({"error": "Invalid credentials"}), 401

        print(f"✅ Login successful for: {user.username}")
        return jsonify({
            "message": f"Welcome {user.username}",
            "username": user.username,
            "email": user.email
        }), 200

    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Initialize database tables
def init_db():
    try:
        print("🔧 Creating database tables...")
        with app.app_context():
            db.create_all()
            print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Database table creation failed: {e}")
        print(f"Traceback: {traceback.format_exc()}")

# Test database connection on startup
def test_db_connection():
    try:
        print("🔧 Testing database connection...")
        with app.app_context():
            result = db.session.execute(db.text('SELECT version()'))
            version = result.fetchone()[0]
            print(f"✅ PostgreSQL version: {version}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("🔍 Possible issues:")
        print("  1. PostgreSQL is not running")
        print("  2. Database 'webssis' doesn't exist")
        print("  3. Wrong credentials (postgres:pointbreak)")
        print("  4. PostgreSQL not running on port 5432")
        return False

# Run server
if __name__ == "__main__":
    print("🚀 Starting Flask application...")
    
    # Test database connection first
    if test_db_connection():
        # Create tables
        init_db()
        print("🌐 Starting server on http://127.0.0.1:5000")
        app.run(debug=True)
    else:
        print("❌ Cannot start server due to database connection issues")
        exit(1)