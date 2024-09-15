import firebase_admin
from firebase_config import db
from firebase_admin import credentials, firestore
import logging



def get_unique_user_by_email(mail):
    try:
        users_collection = db.collection('users')
        print("llegamos al final", mail)
        query = users_collection.where('Mail', '==', mail).stream()
        users = [doc.to_dict() for doc in query]
        
        if users:
            user = users[0]
            user_ref = users_collection.where('Mail', '==', mail).stream()
            user_id = [doc.id for doc in user_ref][0]  
            user['id'] = user_id
            print("final",user)
            return user
        else:
            raise ValueError('No existen usuarios con ese mail')
    except Exception as error:
        print("Error al obtener el usuario:", error)
        raise ValueError('No existen usuarios con ese mail')


def get_user(password, mail):
    try:
        users_collection = db.collection('users')
        query = users_collection.where('password', '==', password).where('mail', '==', mail).stream()
        users = [doc.to_dict() for doc in query]

        if users:
            user = users[0]
            user['uid'] = query[0].id
            return user
        else:
            raise ValueError('Usuario no encontrado')
    except Exception as error:
        print("Error al obtener el usuario:", error)
        raise ValueError("No se pudo obtener el usuario")

def create_user(user):
    try:
        print(user)
        users_collection = db.collection('users')
        users_collection.add(user)
        return user
    except Exception as error:
        print("Error al crear el usuario:", error)
        raise ValueError("No se pudo crear el usuario")

def send_email(to_email):
    try:
        print(f"Enviar correo a: {to_email}")
        return True
    except Exception as error:
        print("Error al enviar el correo:", error)
        return False