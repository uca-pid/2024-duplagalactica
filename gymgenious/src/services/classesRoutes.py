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


def book_class(event, mail):
    try:
        print("hgola")
        print(event, mail)
        users_ref = db.collection('classes')
        docs = users_ref.where('name', '==', event).stream()
        updated = False

        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            current_data = doc_ref.get().to_dict()
            booked_users = current_data.get('BookedUsers', [])
            if mail not in booked_users:
                booked_users.append(mail)
            doc_ref.update({
                'BookedUsers': booked_users
            })
            updated = True

        if not updated:
            print(f"No se encontró una clase con el nombre: {event}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
    
def unbook_class(event, mail):
    try:
        users_ref = db.collection('classes')
        docs = users_ref.where('name', '==', event).stream()
        updated = False

        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            current_data = doc_ref.get().to_dict()
            booked_users = current_data.get('BookedUsers', [])
            if mail in booked_users:
                booked_users.remove(mail)
                doc_ref.update({
                    'BookedUsers': booked_users
                })
                updated = True

        if not updated:
            print(f"No se encontró una clase con el nombre: {event}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")

def delete_class(event,mail):
    try:
        users_ref = db.collection('classes')
        docs = users_ref.where('name', '==', event).where('owner','==',mail).stream()
        deleted_count = 0
        for doc in docs:
            doc.reference.delete()
            deleted_count += 1
        if deleted_count > 0:
            return {"message": f"Se eliminaron {deleted_count} clase(s)"}
        else:
            return {"message": "No se encontraron clases para eliminar"}
    except Exception as e:
        print(f"Error actualizando el usuario: {e}")
        raise RuntimeError("No se pudo actualizar el usuario")
    

def update_class_info(newClass):
    try:
        users_ref = db.collection('classes')
        docs = users_ref.where('name', '==', newClass['NameOriginal']).stream()
        updated = False

        for doc in docs:
            doc_ref = users_ref.document(doc.id)
            doc_ref.update({
                'dateFin': newClass['DateFin'],
                'dateInicio': newClass['DateInicio'],
                'day': newClass['Day'],
                'name': newClass['Name'],
                'permanent': newClass['Permanent']
            })
            updated = True

        if not updated:
            print(f"No se encontró una clase con el nombre: {newClass['NameOriginal']}")
        return {"message": "Actualización realizada"} 
    except Exception as e:
        print(f"Error actualizando la clase: {e}")
        raise RuntimeError("No se pudo actualizar la clase")
