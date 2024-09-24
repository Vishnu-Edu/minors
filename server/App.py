from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import create_engine, text
import pymysql
import urllib.parse

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Default database connection parameters
DEFAULT_DB_DETAILS = {
    'host': 'localhost',
    'port': 3305,  # Port number
    'user': 'root',
    'password': 'Prabhas@123',
    'database': 'projectm'  # Database schema
}

@app.route('/create-tables', methods=['POST'])
def create_tables():
    data = request.json
    db_user = data.get('user', DEFAULT_DB_DETAILS['user'])
    db_password = urllib.parse.quote(data.get('password', DEFAULT_DB_DETAILS['password']))  # URL-encode password
    db_host = data.get('host', DEFAULT_DB_DETAILS['host'])
    db_port = data.get('port', DEFAULT_DB_DETAILS['port'])
    db_name = data.get('database', DEFAULT_DB_DETAILS['database'])

    # Construct the URI in separate parts
    user_info = f"{db_user}:{db_password}"
    host_info = f"{db_host}:{db_port}"
    db_info = f"/{db_name}"

    # Combine the parts into the URI
    db_uri = f"mysql+pymysql://{user_info}@{host_info}{db_info}"
    
    try:
        # Test the connection before proceeding
        engine = create_engine(db_uri)
        with engine.connect() as connection:
            # Create tables if they don't exist
            create_vichoices_table(engine)
            create_allocations_table(engine)
            create_notallocated_table(engine)
            create_and_insert_availability(engine)
            create_low_cgpa_choices_table(engine)
            manage_cgpa_rows(engine)  # Ensure to manage rows
            allot_branches(engine)
            return jsonify({'message': 'Tables created and data inserted successfully!'})
    except pymysql.MySQLError as e:
        return jsonify({'error': f"Database connection error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({'error': f"An error occurred: {str(e)}"}), 500

def create_vichoices_table(engine):
    with engine.connect() as connection:
        result = connection.execute(text("SHOW TABLES LIKE 'vichoices'")).fetchone()
        if not result:
            connection.execute(text("""
                CREATE TABLE vichoices (
                    Roll_Number VARCHAR(20) NOT NULL,
                    Candidate_name VARCHAR(100) NOT NULL,
                    cgpa DECIMAL(3, 2) NOT NULL,
                    choice1 VARCHAR(50) NOT NULL,
                    choice2 VARCHAR(50) NOT NULL,
                    PRIMARY KEY (Roll_Number)
                );
            """))

def create_and_insert_availability(engine):
    with engine.connect() as connection:
        result = connection.execute(text("SHOW TABLES LIKE 'availability'")).fetchone()
        if not result:
            connection.execute(text("""
                CREATE TABLE availability (
                    dept VARCHAR(50),
                    vacancy INT
                )
            """))
            connection.execute(text("""
                INSERT INTO availability (dept, vacancy) VALUES
                ('CIVIL', 21),
                ('EEE', 21),
                ('MECH', 21),
                ('ECE', 63),
                ('CSE', 63),
                ('IT', 63),
                ('CS&BS', 21),
                ('AI&DS', 42),
                ('AI&ML', 42)
            """))

def create_allocations_table(engine):
    with engine.connect() as connection:
        result = connection.execute(text("SHOW TABLES LIKE 'allocations'")).fetchone()
        if not result:
            connection.execute(text("""
                CREATE TABLE allocations (
                    roll_number VARCHAR(20) NOT NULL,
                    Candidate_name VARCHAR(100) NOT NULL,
                    allocated_dept VARCHAR(50) NOT NULL,
                    Choice1 VARCHAR(50) NOT NULL,
                    Choice2 VARCHAR(50) NOT NULL,
                    PRIMARY KEY (roll_number)
                );
            """))

def create_notallocated_table(engine):
    with engine.connect() as connection:
        result = connection.execute(text("SHOW TABLES LIKE 'notallocated'")).fetchone()
        if not result:
            connection.execute(text("""
                CREATE TABLE notallocated (
                    Roll_Number VARCHAR(20) NOT NULL,
                    Candidate_name VARCHAR(100) NOT NULL,
                    cgpa DECIMAL(3, 2) NOT NULL,
                    choice1 VARCHAR(50) NOT NULL,
                    choice2 VARCHAR(50) NOT NULL,
                    PRIMARY KEY (Roll_Number)
                );
            """))

def create_low_cgpa_choices_table(engine):
    with engine.connect() as connection:
        result = connection.execute(text("SHOW TABLES LIKE 'low_cgpa_choices'")).fetchone()
        if not result:
            connection.execute(text("""
                CREATE TABLE low_cgpa_choices (
                    Roll_Number VARCHAR(20) NOT NULL,
                    Candidate_name VARCHAR(100) NOT NULL,
                    cgpa DECIMAL(3, 2) NOT NULL,
                    choice1 VARCHAR(50) NOT NULL,
                    choice2 VARCHAR(50) NOT NULL,
                    PRIMARY KEY (Roll_Number)
                );
            """))

def manage_cgpa_rows(engine):
    with engine.connect() as connection:
        connection.execute(text("""
            INSERT INTO low_cgpa_choices
            SELECT * FROM vichoices WHERE cgpa < 7.75
        """))
        connection.execute(text("""
            DELETE FROM vichoices WHERE cgpa < 7.75
        """))

def allot_branches(engine):
    with engine.connect() as connection:
        students = connection.execute(text("SELECT Roll_Number, Candidate_name, cgpa, choice1, choice2 FROM vichoices")).fetchall()
        for student in students:
            roll_number, name, cgpa, choice1, choice2 = student
            allotted_dept = None

            result = connection.execute(text("SELECT vacancy FROM availability WHERE dept = :dept"), {'dept': choice1}).fetchone()
            if result and result[0] > 0:
                allotted_dept = choice1
                connection.execute(text("UPDATE availability SET vacancy = vacancy - 1 WHERE dept = :dept"), {'dept': choice1})

            if not allotted_dept:
                result = connection.execute(text("SELECT vacancy FROM availability WHERE dept = :dept"), {'dept': choice2}).fetchone()
                if result and result[0] > 0:
                    allotted_dept = choice2
                    connection.execute(text("UPDATE availability SET vacancy = vacancy - 1 WHERE dept = :dept"), {'dept': choice2})

            if allotted_dept:
                connection.execute(text("INSERT INTO allocations (roll_number, Candidate_name, allocated_dept, Choice1, Choice2) VALUES (:roll_number, :name, :dept, :choice1, :choice2)"),
                                   {'roll_number': roll_number, 'name': name, 'dept': allotted_dept, 'choice1': choice1, 'choice2': choice2})
            else:
                connection.execute(text("INSERT INTO notallocated (Roll_Number, Candidate_name, choice1, choice2, cgpa) VALUES (:roll_number, :name, :choice1, :choice2, :cgpa)"),
                                   {'roll_number': roll_number, 'name': name, 'choice1': choice1, 'choice2': choice2, 'cgpa': cgpa})

if __name__ == '__main__':
    app.run(debug=True)
