from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import firebase_admin
from firebase_admin import credentials, firestore
from services.classesRoutes import get_classes, create_class
from Controllers.classesController import get_classes_route, create_class_route 
from Controllers.usersController import get_unique_user_by_email_route, get_user_route, send_email_route, create_user_route


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
    mail = request.args.get('mail')
    return get_unique_user_by_email_route(mail)

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
def send_email_route():
    to_email = request.json.get('toEmail')
    return send_email_route(to_email)





if __name__ == '__main__':
    app.run(debug=True)