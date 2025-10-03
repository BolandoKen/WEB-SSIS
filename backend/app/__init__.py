from flask import Flask
from flask_cors import CORS
from app.db import close_db

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.teardown_appcontext(close_db)

    from app.routes.auth import auth_bp
    from app.routes.colleges import colleges_bp
    from app.routes.programs import programs_bp
    from app.routes.students import students_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(colleges_bp)
    app.register_blueprint(programs_bp)
    app.register_blueprint(students_bp)

    return app