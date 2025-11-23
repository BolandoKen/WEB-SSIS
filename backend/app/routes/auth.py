from flask import Blueprint, request, jsonify
from app.models.auth import User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


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

    user = User.get_by_email(email)
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    user_id, username, user_email, password_hash = user

    if not User.verify_password(password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=user_email)

    return jsonify({
        "message": "Login successful",
        "token": access_token,  # <--- token added
        "user": {
            "id": user_id,
            "username": username,
            "email": user_email
        }
    })

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    user = User.get_by_email(current_user)
    if not user:
        return jsonify({"error": "User not found"}), 404
    user_id, username, email, _ = user
    return jsonify({
        "id": user_id,
        "username": username,
        "email": email
    })
