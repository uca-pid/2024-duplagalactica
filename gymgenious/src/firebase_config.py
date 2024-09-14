import firebase_admin
from firebase_admin import credentials, firestore
import logging

def initialize_firebase():
    if not firebase_admin._apps:
        cred = credentials.Certificate("./serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    return firestore.client()

db = initialize_firebase()
