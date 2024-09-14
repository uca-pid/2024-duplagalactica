import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def create_excersice(excersice):
    try:
        class_ref = db.collection('exersices').add(excersice)
        created_exersice = {**excersice}
        return created_exersice
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
