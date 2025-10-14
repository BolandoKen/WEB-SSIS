from flask import Blueprint, request, jsonify
from app.models import Student

students_bp = Blueprint("students", __name__, url_prefix="/api/students")

@students_bp.route("/", methods=["GET"])
def get_students():
    students = Student.all()
    return jsonify([dict(s) for s in students])

@students_bp.route("/<string:id_number>", methods=["GET"])
def get_student(id_number):
    student = Student.get(id_number)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(dict(student))

@students_bp.route("/check-id/<string:id_number>", methods=["GET"])
def check_id_number(id_number):
    """Check if a student ID number already exists."""
    student = Student.get(id_number)
    return jsonify({"exists": student is not None})

@students_bp.route("", methods=["POST"])
def create_student():
    data = request.get_json()
    idNumber = data.get("idNumber")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    gender = data.get("gender")
    yearLevel = data.get("yearLevel")
    program_id = data.get("program_id")

    print("DEBUG DATA:", data)
    print(idNumber, firstname, lastname, gender, yearLevel, program_id)

    if not idNumber or not firstname or not lastname or not gender or not yearLevel or not program_id:
        return jsonify({"error": "Missing required fields"}), 400

    success = Student.add(idNumber, firstname, lastname, gender, yearLevel, program_id)
    if not success:
        return jsonify({"error": "Failed to create student"}), 400
    return jsonify({"message": "Student created successfully"}), 201

@students_bp.route("", methods=["DELETE"])
def delete_student():

    student_id = request.args.get("id", type=int)
    
    if Student.delete(student_id):
        return jsonify({"message": "Student deleted successfully"})
    else:
        return jsonify({"error": "Failed to delete student"}), 400
    
@students_bp.route("", methods=["PUT"])
def update_student():
    student_id = request.args.get("id", type=int)

    data = request.get_json()
    idNumber = data.get("idNumber")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    gender = data.get("gender")
    yearLevel = data.get("yearLevel")
    program_id = data.get("program_id")

    if not idNumber or not firstname or not lastname or not gender or not yearLevel or not program_id:
        return jsonify({"error": "Missing required fields"}), 400

    if Student.update(student_id, idNumber, firstname, lastname, gender, yearLevel, program_id):
        return jsonify({"message": "Student updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update student"}), 400