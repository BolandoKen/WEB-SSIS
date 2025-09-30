from flask import Blueprint, jsonify, request
from ..models import Student, db

students_bp = Blueprint("students_bp", __name__)

@students_bp.route("/students", methods=["GET"])
def get_students():
    students = Student.query.all()
    return jsonify([{
        "idNumber": s.idNumber,
        "firstname": s.firstname,
        "lastname": s.lastname,
        "gender": s.gender,
        "yearLevel": s.yearLevel,
        "programCode": s.program.programCode if s.program else None
    } for s in students])

@students_bp.route("/students", methods=["POST"])
def create_student():
    data = request.get_json()

    id_number = data.get("idNumber")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    gender = data.get("gender")
    year_level = data.get("yearLevel")
    program_id = data.get("program_id")  # expecting program_id

    if not id_number or not firstname or not lastname:
        return jsonify({"error": "idNumber, firstname, and lastname are required"}), 400

    new_student = Student(
        idNumber=id_number,
        firstname=firstname,
        lastname=lastname,
        gender=gender,
        yearLevel=year_level,
        program_id=program_id
    )
    db.session.add(new_student)
    db.session.commit()

    return jsonify({
        "message": "Student created successfully",
        "student": {
            "idNumber": new_student.idNumber,
            "firstname": new_student.firstname,
            "lastname": new_student.lastname,
            "gender": new_student.gender,
            "yearLevel": new_student.yearLevel,
            "programCode": new_student.programCode
        }
    }), 201
