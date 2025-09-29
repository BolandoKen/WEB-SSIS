from flask import Blueprint, jsonify
from ..models import College, db

college_bp = Blueprint("college_bp", __name__)

@college_bp.route("/colleges", methods=["GET"])
def get_colleges():
    colleges = College.query.all()  # get all rows from College table
    return jsonify([{
        "collegeName": c.collegeName,
        "collegeCode": c.collegeCode
    } for c in colleges])
