from flask import Flask, request, jsonify
from services.exercisesRoutes import create_excersice


def create_exersice_route(excersice):
    try:
        excersice = request.json
        exce = create_excersice(excersice)
        return jsonify(exce), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500