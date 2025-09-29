from flask import Blueprint, jsonify
from ..models import Program, db

program_bp = Blueprint("program_bp", __name__)

@program_bp.route("/programs", methods=["GET"])
def get_programs():
    programs = Program.query.all()
    return jsonify([{
        "programName": p.programName,
        "programCode": p.programCode,
        "collegeCode": p.college.collegeCode if p.college else None
    } for p in programs])
