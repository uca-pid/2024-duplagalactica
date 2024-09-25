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


def update_routine_info(newRoutine):
    try:
        print(newRoutine)
        users_ref = db.collection('routines')
        docs = users_ref.where('name', '==', newRoutine['name']).stream()
        updated = False

        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            doc_ref.update({
                'day': newRoutine['day'],
                'description': newRoutine['description'],
                'excercises': newRoutine['excers']
            })
            updated = True

        if not updated:
            print(f"No se encontró una rutina con el nombre: {newRoutine.name}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando la rutina: {e}")
        raise RuntimeError("No se pudo actualizar la rutina")