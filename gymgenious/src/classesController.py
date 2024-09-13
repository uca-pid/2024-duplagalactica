from flask import Flask, request, jsonify
from flask_cors import CORS
from classesRoutes import get_classes, create_class



def get_classes_route():
    try:
        classes_list = get_classes()
        return jsonify(classes_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def create_class_route(new_class):
    try:
        new_class = request.json
        created_class = create_class(new_class)
        return jsonify(created_class), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


