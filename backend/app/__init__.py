from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Config
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:pointbreak@localhost:5432/webssis'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    # Import and register blueprints
    from .routes.auth import auth_bp
    from .routes.colleges import college_bp
    from .routes.programs import program_bp  
    from .routes.students import students_bp

    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(college_bp, url_prefix="/api")
    app.register_blueprint(program_bp, url_prefix="/api")
    app.register_blueprint(students_bp, url_prefix="/api")

    return app
