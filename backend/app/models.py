from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"

class College(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Auto-increment ID
    collegeCode = db.Column(db.String(10), unique=True, nullable=False)
    collegeName = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return f"<College {self.collegeName}>"

class Program(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Auto-increment ID
    programCode = db.Column(db.String(10), unique=True, nullable=False)
    programName = db.Column(db.String(120), unique=True, nullable=False)
    college_id = db.Column(db.Integer, db.ForeignKey('college.id'), nullable=True)

    college = db.relationship('College', backref=db.backref('programs', lazy=True))

    def __repr__(self):
        return f"<Program {self.programName}>"
    
    @property
    def collegeCode(self):
        return self.college.collegeCode if self.college else None

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Auto-increment ID
    idNumber = db.Column(db.String(9), unique=True, nullable=False)
    firstname = db.Column(db.String(120), nullable=False)
    lastname = db.Column(db.String(120), nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    yearLevel = db.Column(db.String(20), nullable=True)
    program_id = db.Column(db.Integer, db.ForeignKey('program.id'), nullable=False)

    program = db.relationship('Program', backref=db.backref('students', lazy=True))

    def __repr__(self):
        return f"<Student {self.firstname} {self.lastname}>"
    
    @property
    def programCode(self):
        return self.program.programCode if self.program else None
