from flask import Flask, request, jsonify
from usersRoutes import get_unique_user_by_email, get_user, create_user, send_email


def get_unique_user_by_email_route(mail):
    try:
        mail = request.args.get('mail')
        user = get_unique_user_by_email(mail)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def get_user_route(password,mail):
    try:
        password = request.args.get('password')
        mail = request.args.get('mail')
        user = get_user(mail, password)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def create_user_route(user):
    try:
        user = request.json
        created_user = create_user(user)
        return jsonify(created_user), 201
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

def send_email_route(to_email):
    try:
        to_email = request.json.get('toEmail')
        result = send_email(to_email)
        return jsonify(result), 200
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

