from flask import Flask, request, jsonify
from services.routineRoutes import create_routine, assign_routine_to_user,get_routines,get_assigned_routines,update_routine_info,delete_routine


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


def get_routines_route():
    try:
        routines_list = get_routines()
        return jsonify(routines_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def get_assigned_routines_route():
    try:
        routines_list = get_assigned_routines()
        return jsonify(routines_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_routine_info_route(newRoutine):
    try:
        update_routine_info(newRoutine)
        return jsonify({"message": "Rutina actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def delete_routine_route(event):
    try:
        deleted_routine = delete_routine(event)
        return jsonify({"message": "Rutina eliminada exitosamente"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
