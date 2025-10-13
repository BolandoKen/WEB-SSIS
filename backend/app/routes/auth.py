from flask import Blueprint, request, jsonify
from app.models import User 

auth_bp = Blueprint("auth", __name__, url_prefix="/api")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if user already exists
    existing_user = User.get_by_email(email)
    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    # Add new user
    success = User.add(username, email, password)
    if not success:
        return jsonify({"error": "Failed to register user"}), 500

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    # Find user by email
    user = User.get_by_email(email)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # `user` is a tuple or dict depending on how fetchone() is used
    # assuming tuple: (id, username, email, password_hash)
    user_id, username, user_email, password_hash = user

    # Verify password
    if not User.verify_password(password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "user": {
            "id": user_id,
            "username": username,
            "email": user_email
        }
    })
