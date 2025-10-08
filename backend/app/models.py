from app.db import get_db
from psycopg2.extras import RealDictCursor

class College:
    @staticmethod
    def all():
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, collegeCode, collegeName FROM colleges")
        colleges = cursor.fetchall()
        cursor.close()
        return colleges
    
    @staticmethod
    def add(college_code, college_name):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                INSERT INTO colleges (collegeCode, collegeName)
                VALUES (%s, %s)
            """, (college_code, college_name))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            db.rollback()
            cursor.close()
            raise e
    
    @staticmethod
    def delete(college_id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("DELETE FROM colleges WHERE id = %s", (college_id,))
            db.commit()
            deleted = cursor.rowcount > 0
            cursor.close()
            return deleted
        except Exception as e:
            db.rollback()
            cursor.close()
            return False
    
    @staticmethod
    def update(college_id, college_code, college_name):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                UPDATE colleges
                SET collegeCode = %s, collegeName = %s
                WHERE id = %s
            """, (college_code, college_name, college_id))
            db.commit()
            updated = cursor.rowcount > 0
            cursor.close()
            return updated
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error updating college:", e)
            return False

class Program:
    @staticmethod
    def all(college_id=None):
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        
        if college_id:
            cursor.execute("""
                SELECT p.id, p.programCode, p.programName, p.college_id, c.collegeCode, c.collegeName
                FROM programs p
                LEFT JOIN colleges c ON p.college_id = c.id
                WHERE p.college_id = %s
            """, (college_id,))
        else:
            cursor.execute("""
                SELECT p.id, p.programCode, p.programName, p.college_id, c.collegeCode, c.collegeName
                FROM programs p
                LEFT JOIN colleges c ON p.college_id = c.id
            """)
        
        programs = cursor.fetchall()
        cursor.close()
        return programs
  
    @staticmethod
    def get(program_code):
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT p.programCode, p.programName, c.collegeCode
            FROM programs p
            JOIN colleges c ON p.college_id = c.id
            WHERE p.programCode = %s
        """, (program_code,))
        program = cursor.fetchone()
        cursor.close()
        return program
    
    @staticmethod
    def add(program_code, program_name, college_id):

        """Add a new program"""
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                INSERT INTO programs (programCode, programName, college_id)
                VALUES (%s, %s, %s)
            """, (program_code, program_name, college_id))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            db.rollback()
            cursor.close()
            raise e
        
    @staticmethod
    def delete(program_id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("DELETE FROM programs WHERE id = %s", (program_id,))
            db.commit()
            deleted = cursor.rowcount > 0
            cursor.close()
            return deleted
        except Exception as e:
            db.rollback()
            cursor.close()
            return False
        
    @staticmethod
    def update(program_id, program_code, program_name, college_id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                UPDATE programs
                SET programCode = %s, programName = %s, college_id = %s
                WHERE id = %s
            """, (program_code, program_name, college_id, program_id))
            db.commit()
            updated = cursor.rowcount > 0
            cursor.close()
            return updated
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error updating program:", e)
            return False

class Student:
    @staticmethod
    def all():
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT s.id, s.idnumber, s.firstname, s.lastname, s.gender, s.yearlevel,
                p.programcode
            FROM students s
            LEFT JOIN programs p ON s.program_id = p.id
        """)
        students = cursor.fetchall()
        cursor.close()
        return students
    
    @staticmethod
    def get(id_number):
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT s.idNumber, s.firstname, s.lastname, s.gender, s.yearLevel, p.programCode
            FROM students s
            JOIN programs p ON s.program_id = p.id
            WHERE s.idNumber = %s
        """, (id_number,))
        student = cursor.fetchone()
        cursor.close()
        return student
    
    @staticmethod
    def add(idNumber, firstname, lastname, gender, yearLevel, program_id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                INSERT INTO students (idNumber, firstname, lastname, gender, yearLevel, program_id)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (idNumber, firstname, lastname, gender, yearLevel, program_id))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            db.rollback()
            cursor.close()
            raise e
    
    @staticmethod
    def delete(id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("DELETE FROM students WHERE id = %s", (id,))
            db.commit()
            deleted = cursor.rowcount > 0
            cursor.close()
            return deleted
        except Exception as e:
            db.rollback()
            cursor.close()
            return False
        
    @staticmethod
    def update(student_id, idNumber, firstname, lastname, gender, yearLevel, program_id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                UPDATE students
                SET idNumber = %s, firstname = %s, lastname = %s, gender = %s, yearLevel = %s, program_id = %s
                WHERE id = %s
            """, (idNumber, firstname, lastname, gender, yearLevel, program_id, student_id))
            db.commit()
            updated = cursor.rowcount > 0
            cursor.close()
            return updated
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error updating student:", e)
            return False