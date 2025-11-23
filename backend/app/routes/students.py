from flask import Blueprint, request, jsonify
from app.models.students import Student
import os
import uuid
from app.supabase_client import supabase
from storage3.exceptions import StorageApiError
from app.db import get_db  # Correct import

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
    profile_photo_url = data.get("profile_photo_url")

    if not idNumber or not firstname or not lastname or not gender or not yearLevel or not program_id:
        return jsonify({"error": "Missing required fields"}), 400

    success = Student.add(idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url)
    if not success:
        return jsonify({"error": "Failed to create student"}), 400

    return jsonify({"message": "Student created successfully"}), 201

@students_bp.route("", methods=["DELETE"])
def delete_student():
    student_id = request.args.get("id", type=int)
    
    # Get database connection using the correct method
    db = get_db()
    cursor = db.cursor()
    
    try:
        # Fetch the student's profile photo URL before deletion
        cursor.execute("SELECT profile_photo_url FROM students WHERE id = %s", (student_id,))
        result = cursor.fetchone()
        
        if result and result[0]:
            profile_photo_url = result[0]
            # Extract filename from URL
            if "/storage/v1/object/public/student-photos/" in profile_photo_url:
                filename = profile_photo_url.split("/storage/v1/object/public/student-photos/")[1]
                try:
                    # Delete the photo from storage
                    supabase.storage.from_("student-photos").remove([filename])
                    print(f"Deleted profile photo: {filename}")
                except StorageApiError as e:
                    print(f"Failed to delete photo: {e}")
                    # Continue with student deletion even if photo deletion fails
        
        # Now delete the student record using the model method
        cursor.close()
        if Student.delete(student_id):
            return jsonify({"message": "Student deleted successfully"})
        else:
            return jsonify({"error": "Failed to delete student"}), 400
            
    except Exception as e:
        print(f"Error during deletion: {e}")
        cursor.close()
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
    profile_photo_url = data.get("profile_photo_url") or None

    if not idNumber or not firstname or not lastname or not gender or not yearLevel or not program_id:
        return jsonify({"error": "Missing required fields"}), 400

    if Student.update(student_id, idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url):
        return jsonify({"message": "Student updated successfully"}), 200
    else:
        return jsonify({"error": "Failed to update student"}), 400

@students_bp.route("/upload-profile", methods=["POST"])
def upload_profile():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"

    try:
        supabase.storage.from_("student-photos").upload(filename, file.read())
        public_url = supabase.storage.from_("student-photos").get_public_url(filename)
        return jsonify({"url": public_url}), 200

    except StorageApiError as e:
        return jsonify({"error": f"Upload failed: {e}"}), 500

@students_bp.route("/delete-profile", methods=["DELETE"])
def delete_profile():
    filename = request.args.get("filename")
    if not filename:
        return jsonify({"error": "No file specified"}), 400

    try:
        supabase.storage.from_("student-photos").remove([filename])
        return jsonify({"message": "Deleted"}), 200
    except StorageApiError as e:
        return jsonify({"error": str(e)}), 500