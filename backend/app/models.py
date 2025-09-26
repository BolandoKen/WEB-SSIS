from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"

class College(db.Model):
    collegeName = db.Column(db.String(120), primary_key=True)
    collegeCode = db.Column(db.String(10), unique=True, nullable=False)

    def __repr__(self):
        return f"<College {self.collegeName}>"