from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from Controllers.classesController import get_classes_route, create_class_route,book_class_route,unbook_class_route,delete_class_route,update_class_info_route
from Controllers.usersController import get_unique_user_by_email_route ,get_user_route, send_email_route, create_user_route,get_users_route,get_clients_users_route,get_client_users_no_match_routine_route,update_users_info_route
from Controllers.excersicesController import create_exersice_route,get_excersice_by_owner_route,get_excersices_route
from Controllers.routineController import create_routine_route,assign_routine_to_user_route,get_routines_route,get_assigned_routines_route,update_routine_info_route,delete_routine_route

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})




@app.route('/get_classes', methods=['GET'])
def get_classes():
    return get_classes_route()

@app.route('/create_class', methods=['POST'])
def create_class():
    
    new_class = request.json
    return create_class_route(new_class)

@app.route('/update_class_info', methods=['PUT'])
def update_class_info():
    newUser = request.json.get('newUser')
    print(newUser)
    return update_class_info_route(newUser)

@app.route('/book_class', methods=['PUT'])
def book_class():
    event = request.json.get('event')
    mail = request.json.get('mail')
    return book_class_route(event,mail)

@app.route('/unbook_class', methods=['PUT'])
def unbook_class():
    event = request.json.get('event')
    mail = request.json.get('mail')
    return unbook_class_route(event,mail)

@app.route('/delete_class', methods=['DELETE'])
def delete_class():
    event = request.json.get('event')
    mail = request.json.get('mail')
    return delete_class_route(event,mail)

@app.route('/delete_routine', methods=['DELETE'])
def delete_routine():
    event = request.json.get('event')
    return delete_routine_route(event)

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


@app.route('/update_users_info', methods=['PUT'])
def update_users_info():
    newUser = request.json.get('newUser')
    return update_users_info_route(newUser)

@app.route('/update_routine_info', methods=['PUT'])
def update_routine_info():
    newRoutine = request.json.get('newRoutine')
    return update_routine_info_route(newRoutine)


@app.route('/get_users', methods=['GET'])
def get_users():
    return get_users_route()

@app.route('/get_client_users', methods=['GET'])
def get_client_users():
    return get_clients_users_route()

@app.route('/get_client_users_no_match_routine', methods=['GET'])
def get_client_users_no_match_routine():
    routine = request.args.get('routine')
    return get_client_users_no_match_routine_route(routine)


@app.route('/get_excersice_by_owner', methods=['GET'])
def get_excersice_by_owner():
    owner = request.args.get('owner')
    return get_excersice_by_owner_route(owner)

@app.route('/get_excersices', methods=['GET'])
def get_excersices():
    return get_excersices_route()


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


@app.route('/get_assigned_routines', methods=['GET'])
def get_assigned_routines():
    return get_assigned_routines_route()


if __name__ == '__main__':
    app.run(debug=True)