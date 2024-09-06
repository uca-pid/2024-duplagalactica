const admin = require('firebase-admin');
const path = require('path');

// Asegúrate de que la ruta sea correcta
const serviceAccount = require(path.resolve(__dirname, './serviceAccountKey.json'));

// Inicializar Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Datos de ejemplo
const classes = [
  { name: 'Yoga', date: '2024-09-03T15:00:00Z', hour: '15:00', day: 'Tuesday', permanent: false },
  { name: 'Boxeo', date: '2024-09-10T20:00:00Z', hour: '20:00', day: 'Tuesday', permanent: true }
];

const users = [
  { mail: 'chichanello@gmail.com', name: 'Ignacio', lastname: 'Fanello', password: '123456789', birthday: '2001-01-01T00:00:00Z', gym: 'O3' }
];

async function migrateData() {
  try {
    // Insertar datos en la colección 'classes'
    const classesCollection = db.collection('classes');
    for (const cls of classes) {
      await classesCollection.add(cls);
      console.log(`Clase '${cls.name}' añadida.`);
    }

    // Insertar datos en la colección 'users'
    const usersCollection = db.collection('users');
    for (const usr of users) {
      await usersCollection.add(usr);
      console.log(`Usuario '${usr.mail}' añadido.`);
    }

    console.log('Datos migrados exitosamente.');
  } catch (error) {
    console.error('Error al migrar los datos:', error);
  }
}

migrateData();
