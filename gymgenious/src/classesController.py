from flask import Flask, request, jsonify
from flask_cors import CORS
from classesRoutes import get_classes, create_class



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})




@app.route('/get_classes', methods=['GET'])
def get_classes_route():
    try:
        print("toy aca")
        classes_list = get_classes()
        print("toy aca 3")
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/create_class', methods=['POST'])
def create_class_route():
    try:
        new_class = request.json
        created_class = create_class(new_class)
        return jsonify(created_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
