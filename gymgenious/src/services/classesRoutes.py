import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def get_classes():
    try:
        classes_ref = db.collection('classes')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")

def create_class(new_class):
    try:
        class_ref = db.collection('classes').add(new_class)
        created_class = {**new_class}
        return created_class
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
