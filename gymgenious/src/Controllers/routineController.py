from flask import Flask, request, jsonify
from services.routineRoutes import create_routine, assign_routine_to_user


def create_routine_route(newRoutine):
    try:
        newRoutine = request.json
        exce = create_routine(newRoutine)
        return jsonify(exce), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500
    
def assign_routine_to_user_route(newAssignRoutine):
    try:
        newAssignRoutine = request.json
        exce = assign_routine_to_user(newAssignRoutine)
        return jsonify(exce), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500