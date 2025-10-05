from flask import Blueprint, jsonify, request
from app.models import College

colleges_bp = Blueprint("colleges", __name__, url_prefix="/api/colleges")

# GET all colleges
@colleges_bp.route("/", methods=["GET"])
def get_colleges():
    colleges = College.all()
    return jsonify([
        {
            "id": c[0],
            "collegeCode": c[1],
            "collegeName": c[2]
        }
        for c in colleges
    ])

@colleges_bp.route("", methods=["POST"])
def create_college():
    data = request.get_json()
    collegename = data.get("collegename")
    collegecode = data.get("collegecode")

    if not collegename or not collegecode:
        return jsonify({"error": "Both collegename and collegecode are required"}), 400

    try:
        College.add(collegecode, collegename)
        return jsonify({"message": "College added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@colleges_bp.route("", methods=["DELETE"])
def delete_college():
    # Get the id from query params
    college_id = request.args.get("id", type=int)
    
    if not college_id:
        return jsonify({"error": "College ID is required"}), 400

    if College.delete(college_id):
        return jsonify({"message": "College deleted successfully"})
    else:
        return jsonify({"error": "Failed to delete college"}), 400