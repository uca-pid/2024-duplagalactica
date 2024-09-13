from flask import Flask, request, jsonify
from user_service import get_unique_user_by_email, get_user, create_user, send_email

app = Flask(__name__)

@app.route('/get_user_by_email', methods=['GET'])
def get_user_by_email():
    try:
        mail = request.args.get('mail')
        user = get_unique_user_by_email(mail)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "No se pudo obtener el usuario"}), 500

@app.route('/get_user', methods=['GET'])
def get_user_route():
    try:
        mail = request.args.get('mail')
        password = request.args.get('password')
        user = get_user(mail, password)
        return jsonify(user), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": "No se pudo obtener el usuario"}), 500

@app.route('/create_user', methods=['POST'])
def create_user_route():
    try:
        user = request.json
        created_user = create_user(user)
        return jsonify(created_user), 201
    except Exception as e:
        return jsonify({"error": "No se pudo crear el usuario"}), 500

@app.route('/send_email', methods=['POST'])
def send_email_route():
    try:
        to_email = request.json.get('toEmail')
        response = send_email(to_email)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": "No se pudo enviar el correo"}), 500

if __name__ == '__main__':
    app.run(debug=True)
