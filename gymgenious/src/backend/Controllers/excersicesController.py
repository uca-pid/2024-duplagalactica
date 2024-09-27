from flask import Flask, request, jsonify
from services.exercisesRoutes import create_excersice,get_excersice_by_owner,get_excersices


def create_exersice_route(excersice):
    try:
        excersice = request.json
        exce = create_excersice(excersice)
        return jsonify(exce), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

        

def get_excersice_by_owner_route(owner):
    try:
        print("aaaaa",owner)
        users_list = get_excersice_by_owner(owner)
        print("toy aca")
        print(jsonify(users_list),200)
        return jsonify(users_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_excersices_route():
    try:
        routines_list = get_excersices()
        return jsonify(routines_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500