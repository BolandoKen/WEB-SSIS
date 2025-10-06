import psycopg2
from psycopg2.extras import RealDictCursor
from flask import g
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE = {
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT")
}


def get_db():
    if "db" not in g:
        g.db = psycopg2.connect(**DATABASE)
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    cursor = db.cursor()

    # Create tables if they don't exist
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        username VARCHAR(80) UNIQUE NOT NULL,
        email VARCHAR(120) UNIQUE NOT NULL,
        password_hash VARCHAR(512) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS colleges (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        collegeCode VARCHAR(10) UNIQUE NOT NULL,
        collegeName VARCHAR(120) UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS programs (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        programCode VARCHAR(10) UNIQUE NOT NULL,
        programName VARCHAR(120) UNIQUE NOT NULL,
        college_id INT REFERENCES colleges(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS students (
        id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        idNumber VARCHAR(9) UNIQUE NOT NULL,
        firstname VARCHAR(120) NOT NULL,
        lastname VARCHAR(120) NOT NULL,
        gender VARCHAR(10) NOT NULL,
        yearLevel VARCHAR(20) NOT NULL,
        program_id INT REFERENCES programs(id) ON DELETE SET NULL
    );

    """)

    db.commit()
    cursor.close()