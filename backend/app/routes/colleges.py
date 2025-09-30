from flask import Blueprint, jsonify, request
from ..models import College, db

college_bp = Blueprint("college_bp", __name__)

@college_bp.route("/colleges", methods=["GET"])
def get_colleges():
    colleges = College.query.all()  # get all rows from College table
    return jsonify([{
        "collegeName": c.collegeName,
        "collegeCode": c.collegeCode
    } for c in colleges])

@college_bp.route("/colleges", methods=["POST"])
def create_college():
    data = request.get_json()  # get JSON body from frontend

    college_name = data.get("collegeName")
    college_code = data.get("collegeCode")

    if not college_name or not college_code:
        return jsonify({"error": "Both collegeName and collegeCode are required"}), 400

    # make new College instance
    new_college = College(collegeName=college_name, collegeCode=college_code)
    db.session.add(new_college)
    db.session.commit()

    return jsonify({
        "message": "College created successfully",
        "college": {
            "collegeName": new_college.collegeName,
            "collegeCode": new_college.collegeCode
        }
    }), 201