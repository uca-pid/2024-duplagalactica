import firebase_admin
from firebase_admin import credentials, firestore
import logging

logging.basicConfig(level=logging.INFO)

try:
    cred = credentials.Certificate("./serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logging.info("Conexión a Firestore establecida con éxito.")
except Exception as e:
    logging.error(f"Error al inicializar Firebase: {e}")
    raise
db = firestore.client()

def get_classes():
    try:
        print("toy aca2")
        classes_ref = db.collection('classes')
        print("toy aca3")
        docs = classes_ref.stream()
        print(docs)
        classes = [{'id': doc.id, **doc.to_dict()} for doc in docs]
        print(classes)
        return classes
    except Exception as e:
        print(f"Error al obtener las clases: {e}")
        raise RuntimeError("No se pudo obtener las clases")

def create_class(new_class):
    try:
        class_ref = db.collection('classes').add(new_class)
        created_class = {'id': class_ref.id, **new_class}
        return created_class
    except Exception as e:
        print(f"Error al crear la clase: {e}")
        raise RuntimeError("No se pudo crear la clase")
