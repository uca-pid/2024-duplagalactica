import firebase_admin
from firebase_admin import credentials, firestore
import logging
import json
import os
from dotenv import load_dotenv

load_dotenv()
firebase_cred_json = os.getenv('FIREBASECREDENTIALS')
def initialize_firebase():
    if not firebase_admin._apps:
        firebase_creds_dict = json.loads(firebase_cred_json)
        cred = credentials.Certificate(firebase_creds_dict)
        firebase_admin.initialize_app(cred, {
            'storageBucket': 'pid22-40703.appspot.com'  
        })
    return firestore.client()

db = initialize_firebase()