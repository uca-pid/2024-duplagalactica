import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def create_routine(newRoutine):
    try:
        class_ref = db.collection('routines').add(newRoutine)
        created_routine = {**newRoutine}
        return created_routine
    except Exception as e:
        print(f"Error al crear la rutine: {e}")
        raise RuntimeError("No se pudo crear la rutina")


def assign_routine_to_user(newAssignRoutine):
    try:
        class_ref = db.collection('assigned_routines').add(newAssignRoutine)
        created_routine = {**newAssignRoutine}
        return created_routine
    except Exception as e:
        print(f"Error al asignar la rutine: {e}")
        raise RuntimeError("No se pudo asignar la rutina")
    

def get_routines():
    try:
        routines_ref = db.collection('routines')
        docs = routines_ref.stream()
        routines = [{**doc.to_dict()} for doc in docs]
        return routines
    except Exception as e:
        print(f"Error al obtener las rutinas: {e}")
        raise RuntimeError("No se pudo obtener las rutinas")
    
def get_assigned_routines():
    try:
        routines_ref = db.collection('assigned_routines')
        docs = routines_ref.stream()
        routines = [{**doc.to_dict()} for doc in docs]
        return routines
    except Exception as e:
        print(f"Error al obtener las rutinas: {e}")
        raise RuntimeError("No se pudo obtener las rutinas")