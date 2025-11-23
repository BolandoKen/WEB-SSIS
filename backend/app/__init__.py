import os
from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.db import close_db
from dotenv import load_dotenv

load_dotenv()

def create_app():
    # Correct path: from backend/app → ../frontend/build
    static_folder_path = os.path.join(os.path.dirname(__file__), "../../frontend/build")
    app = Flask(__name__, static_folder=static_folder_path, static_url_path="/")

    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    jwt = JWTManager(app)

    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    CORS(app)
    app.teardown_appcontext(close_db)

    # --- Register Blueprints ---
    from app.routes.auth import auth_bp
    from app.routes.colleges import colleges_bp
    from app.routes.programs import programs_bp
    from app.routes.students import students_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(colleges_bp)
    app.register_blueprint(programs_bp)
    app.register_blueprint(students_bp)

    # --- Serve React frontend ---
    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        build_dir = app.static_folder
        index_file = os.path.join(build_dir, "index.html")

        if path != "" and os.path.exists(os.path.join(build_dir, path)):
            return send_from_directory(build_dir, path)
        elif os.path.exists(index_file):
            return send_from_directory(build_dir, "index.html")
        else:
            return "React build not found. Did you run 'npm run build'?", 404

    return app
