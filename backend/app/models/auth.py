from app.db import get_db
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

class User:
    @staticmethod
    def all():
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, username, email FROM users")
        users = cursor.fetchall()
        cursor.close()
        return users

    @staticmethod
    def add(username, email, password):
        db = get_db()
        cursor = db.cursor()
        password_hash = generate_password_hash(password)
        try:
            cursor.execute("""
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
            """, (username, email, password_hash))
            db.commit()
            cursor.close()
            return True
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error adding user:", e)
            return False

    @staticmethod
    def delete(user_id):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
            db.commit()
            deleted = cursor.rowcount > 0
            cursor.close()
            return deleted
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error deleting user:", e)
            return False

    @staticmethod
    def update(user_id, username, email, password=None):
        db = get_db()
        cursor = db.cursor()
        try:
            if password:
                password_hash = generate_password_hash(password)
                cursor.execute("""
                    UPDATE users
                    SET username = %s, email = %s, password_hash = %s
                    WHERE id = %s
                """, (username, email, password_hash, user_id))
            else:
                cursor.execute("""
                    UPDATE users
                    SET username = %s, email = %s
                    WHERE id = %s
                """, (username, email, user_id))

            db.commit()
            updated = cursor.rowcount > 0
            cursor.close()
            return updated
        except Exception as e:
            db.rollback()
            cursor.close()
            print("Error updating user:", e)
            return False

    @staticmethod
    def get_by_id(user_id):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, username, email, password_hash FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        return user

    @staticmethod
    def get_by_email(email):
        db = get_db()
        cursor = db.cursor()
        cursor.execute("SELECT id, username, email, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        return user

    @staticmethod
    def verify_password(stored_hash, password):
        return check_password_hash(stored_hash, password)
