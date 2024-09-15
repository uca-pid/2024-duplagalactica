from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from Controllers.classesController import get_classes_route, create_class_route 
from Controllers.usersController import get_unique_user_by_email_route, get_user_route, send_email_route, create_user_route,get_users_route,get_clients_users_route
from Controllers.excersicesController import create_exersice_route
from Controllers.routineController import create_routine_route,assign_routine_to_user_route,get_routines_route

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})




@app.route('/get_classes', methods=['GET'])
def get_classes():
    return get_classes_route()

@app.route('/create_class', methods=['POST'])
def create_class():
    
    new_class = request.json
    return create_class_route(new_class)

@app.route('/get_unique_user_by_email', methods=['GET'])
def get_unique_user_by_email():
    username = request.args.get('mail')
    print(f"Received email: {username}")
    return get_unique_user_by_email_route(username)

@app.route('/get_user', methods=['GET'])
def get_user():
    password = request.args.get('password')
    mail = request.args.get('mail')
    return get_user_route(password,mail)

@app.route('/create_user', methods=['POST'])
def create_user():
    user = request.json
    return create_user_route(user)

@app.route('/send_email', methods=['POST'])
def send_email():
    to_email = request.json.get('toEmail')
    return send_email_route(to_email)



@app.route('/get_users', methods=['GET'])
def get_users():
    return get_users_route()

@app.route('/get_client_users', methods=['GET'])
def get_client_users():
    return get_clients_users_route()




@app.route('/create_exersice', methods=['POST'])
def create_exersice():
    newExersice = request.json
    return create_exersice_route(newExersice)

@app.route('/create_routine', methods=['POST'])
def create_routine():
    newRoutine = request.json
    return create_routine_route(newRoutine)


@app.route('/get_routines', methods=['GET'])
def get_routines():
    return get_routines_route()

@app.route('/assign_routine_to_user', methods=['POST'])
def assign_routine_to_user():
    newAssignRoutine = request.json
    return assign_routine_to_user_route(newAssignRoutine)

if __name__ == '__main__':
    app.run(debug=True)