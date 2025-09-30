from flask import Blueprint, jsonify, request
from ..models import Program, db

program_bp = Blueprint("program_bp", __name__)

@program_bp.route("/programs", methods=["GET"])
def get_programs():  
    college_id = request.args.get("college_id", type=int)
    if college_id:
        programs = Program.query.filter_by(college_id=college_id).all()
    else:
        programs = Program.query.all()

    return jsonify([{
        "id": p.id,
        "programName": p.programName,
        "programCode": p.programCode,
        "collegeCode": p.college.collegeCode if p.college else None
    } for p in programs])

@program_bp.route("/programs", methods=["POST"])
def create_program():
    data = request.get_json()

    program_name = data.get("programName")
    program_code = data.get("programCode")
    college_id = data.get("college_id")  

    if not program_name or not program_code or not college_id:
        return jsonify({"error": "programName, programCode, and college_id are required"}), 400

    new_program = Program(
        programName=program_name,
        programCode=program_code,
        college_id=college_id
    )
    db.session.add(new_program)
    db.session.commit()

    return jsonify({
        "message": "Program created successfully",
        "program": {
            "programName": new_program.programName,
            "programCode": new_program.programCode,
            "collegeCode": new_program.college.collegeCode  
        }
    }), 201



