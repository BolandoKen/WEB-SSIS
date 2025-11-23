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