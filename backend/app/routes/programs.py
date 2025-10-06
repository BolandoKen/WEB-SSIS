from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from app.models import Program, get_db
programs_bp = Blueprint("programs", __name__, url_prefix="/api/programs")

@programs_bp.route("/", methods=["GET"])
def get_programs():
    college_id = request.args.get("college_id", type=int)
    programs = Program.all(college_id=college_id)
    return jsonify([dict(p) for p in programs])

@programs_bp.route("/<string:program_code>", methods=["GET"])
def get_program(program_code):
    program = Program.get(program_code)
    if not program:
        return jsonify({"error": "Program not found"}), 404
    return jsonify(dict(program))

@programs_bp.route("", methods=["POST"])
def create_program():
    data = request.get_json()

    program_code = data.get("programCode")
    program_name = data.get("programName")
    college_id = data.get("college_id")

    if not program_code or not program_name or not college_id:
        return jsonify({"error": "Missing required fields"}), 400

    # Check if program already exists
    if Program.get(program_code):
        return jsonify({"error": "Program already exists"}), 400

    # Add program using helper
    try:
        Program.add(program_code, program_name, college_id)
        return jsonify({"message": "Program created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@programs_bp.route("", methods=["DELETE"])
def delete_program():
    program_id = request.args.get("id", type=int)

    if Program.delete(program_id):
        return jsonify({"message": "Program deleted successfully"})
    else:
        return jsonify({"error": "Failed to delete program"}), 400