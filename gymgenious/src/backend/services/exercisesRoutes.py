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

def get_excersice_by_owner(owner):
    try:
        routines_ref = db.collection('exersices')
        docs = routines_ref.where('owner', '==', owner).stream()
        datitos = [{**doc.to_dict()} for doc in docs] 
        return datitos
    except Exception as e:
        print(f"Error al obtener los ejercicios: {e}")
        raise RuntimeError("No se pudo obtener los ejercicios")

def get_excersices():
    try:
        routines_ref = db.collection('exersices')
        docs = routines_ref.stream()
        datitos = [{'id': doc.id,**doc.to_dict()} for doc in docs] 
        return datitos
    except Exception as e:
        print(f"Error al obtener los ejercicios: {e}")
        raise RuntimeError("No se pudo obtener los ejercicios")
