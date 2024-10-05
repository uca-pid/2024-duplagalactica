import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def get_salas():
    try:
        classes_ref = db.collection('salas')
        docs = classes_ref.stream()
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        return classes
    except Exception as e:
        print(f"Error al obtener las salas: {e}")
        raise RuntimeError("No se pudo obtener las salas")
