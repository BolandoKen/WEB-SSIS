from flask import Blueprint, jsonify
from ..models import College, db

students_bp = Blueprint("students_bp", __name__)

@students_bp.route("/students", methods=["GET"])
def get_students():
    students = Student.query.all()
    return jsonify([{
        "IdNumber": s.IdNumber,
        "Firstname": s.Firstname,
        "Lastname": s.Lastname,
        "Gender": s.Gender,
        "YearLevel": s.YearLevel,
        "programCode": s.program.programCode if s.program else None
    } for s in students])