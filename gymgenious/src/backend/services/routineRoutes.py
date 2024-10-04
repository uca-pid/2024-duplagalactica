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
        routines = [{**doc.to_dict(), 'id': doc.id} for doc in docs]
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
        users_ref = db.collection('routines')
        doc_ref = users_ref.document(newRoutine['rid'])
        doc = doc_ref.get()
        print("rutina nueva",newRoutine)
        if doc.exists:        
            doc_ref.update({
                'day': newRoutine['day'],
                'description': newRoutine['description'],
                'name': newRoutine['name'],
                'excercises': newRoutine['excers']
            })
            
            return {"message": "Actualización realizada"}
        else:
            print(f"No se encontró una rutina con el id: {newRoutine['rid']}")
            return {"message": "No se encontró la rutina"}

    except Exception as e:
        print(f"Error actualizando la rutina: {e}")
        raise RuntimeError("No se pudo actualizar la rutina")

def delete_routine(event):
    try:
        print("uionbviusunhisfujn")
        users_ref = db.collection('routines')
        print("aaaaa",event)
        doc_ref = users_ref.document(event['id'])
        doc = doc_ref.get()
        if doc.exists:
            assigned_routines = db.collection('assigned_routines')
            assigned_ref = assigned_routines.where('id', '==', doc.id).stream()
            for assigned_doc in assigned_ref:
                assigned_doc.reference.delete()
            doc_ref.delete()
            return {"message": "Rutina eliminada correctamente"}
        else:
            print(f"No se encontró una rutina con el ID: {event}")
            return {"message": "No se encontró la rutina"}
            
    except Exception as e:
        print(f"Error eliminando la rutina: {e}")
        raise RuntimeError("No se pudo eliminar la rutina")
