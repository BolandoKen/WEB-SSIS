from app.db import get_db
from psycopg2.extras import RealDictCursor

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
    def by_college(college_id):
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT p.id, p.programCode, p.programName,
                   p.college_id, c.collegeCode, c.collegeName
            FROM programs p
            LEFT JOIN colleges c ON p.college_id = c.id
            WHERE p.college_id = %s
        """, (college_id,))
        return cursor.fetchall()
    
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
        
    @staticmethod
    def exists_name_global(name, ignore_id=None):
        """Check if program name exists globally (case-insensitive), optionally ignoring a program by ID."""
        conn = get_db()
        cur = conn.cursor()

        if ignore_id:
            cur.execute(
                "SELECT 1 FROM programs WHERE LOWER(programname) = LOWER(%s) AND id != %s",
                (name, ignore_id)
            )
        else:
            cur.execute(
                "SELECT 1 FROM programs WHERE LOWER(programname) = LOWER(%s)",
                (name,)
            )

        exists = cur.fetchone() is not None
        cur.close()
        conn.close()
        return exists

    @staticmethod
    def exists_code_global(code, ignore_id=None):
        """Check if program code exists globally (case-sensitive), optionally ignoring a program by ID."""
        conn = get_db()
        cur = conn.cursor()

        if ignore_id:
            cur.execute(
                "SELECT 1 FROM programs WHERE programcode = %s AND id != %s",
                (code, ignore_id)
            )
        else:
            cur.execute(
                "SELECT 1 FROM programs WHERE programcode = %s",
                (code,)
            )

        exists = cur.fetchone() is not None
        cur.close()
        conn.close()
        return exists
    