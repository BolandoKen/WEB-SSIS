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

class Program(db.Model):
    programName = db.Column(db.String(120), primary_key=True)
    programCode = db.Column(db.String(10), unique=True, nullable=False)
    collegeName = db.Column(db.String(120), db.ForeignKey('college.collegeName'), nullable=False)
    college = db.relationship('College', backref=db.backref('programs', lazy=True))

    def __repr__(self):
        return f"<Program {self.programName}>"
    
class Student(db.Model):
    Firstname = db.Column(db.String(120), nullable=False)
    Lastname = db.Column(db.String(120), nullable=False)
    Gender = db.Column(db.String(10), nullable=False)
    IdNumber = db.Column(db.String(9), primary_key=True)
    YearLevel = db.Column(db.String(20), nullable=False)
    ProgramCode = db.Column(db.String(10), db.ForeignKey('program.programCode'), nullable=False)

    def __repr__(self):
        return f"<Student {self.Firstname} {self.Lastname}>"