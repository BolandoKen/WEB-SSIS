from app.db import get_db
from psycopg2.extras import RealDictCursor

class Student:
    @staticmethod
    def all():
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT 
                s.id,
                s.idnumber,
                s.firstname,
                s.lastname,
                s.gender,
                s.yearlevel,
                s.program_id,
                s.profile_photo_url,  -- add this
                p.programcode,
                p.programname,
                c.id AS college_id,
                c.collegecode,
                c.collegename
            FROM students s
            LEFT JOIN programs p ON s.program_id = p.id
            LEFT JOIN colleges c ON p.college_id = c.id
        """)
        students = cursor.fetchall()
        cursor.close()
        return students

    @staticmethod
    def get(id_number):
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT s.idNumber, s.firstname, s.lastname, s.gender, s.yearLevel,
                s.profile_photo_url,  -- add this
                p.programCode
            FROM students s
            JOIN programs p ON s.program_id = p.id
            WHERE s.idNumber = %s
        """, (id_number,))
        student = cursor.fetchone()
        cursor.close()
        return student

    @staticmethod
    def add(idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url=None):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                INSERT INTO students (idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url))
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
    def update(student_id, idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("""
                UPDATE students
                SET idNumber = %s,
                    firstname = %s,
                    lastname = %s,
                    gender = %s,
                    yearLevel = %s,
                    program_id = %s,
                    profile_photo_url = %s
                WHERE id = %s
            """, (idNumber, firstname, lastname, gender, yearLevel, program_id, profile_photo_url, student_id))
            db.commit()
            updated = cursor.rowcount > 0
            cursor.close()
            return updated
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error updating student:", e)
            return False
        
    @staticmethod
    def get_profile_photo_url(student_id):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT profile_photo_url FROM students WHERE id = %s", (student_id,))
        result = cursor.fetchone()
        cursor.close()
        return result[0] if result else None
        