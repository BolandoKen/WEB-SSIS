from flask import Blueprint, jsonify
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