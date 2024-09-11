import { firestore } from '../firebase-config'; 
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';


export const getUniqueUserByEmail = async (mail) => {
    try {
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, where('Mail', '==', mail));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (users.length > 0) {
        return users[0];
      } else {
        throw new Error('No existen usuarios con ese mail');
      }
    } catch (error) {
      throw new Error('No existen usuarios con ese mail');
    }
  };
  
  
  export const getUser = async (password, mail) => {
    try {
      const usersCollection = collection(firestore, 'users');
      const q = query(usersCollection, where('password', '==', password), where('mail', '==', mail));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (users.length > 0) {
        return users[0];
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  };
  
  export const createUser = async (user) => {
    try {
      await addDoc(collection(firestore, 'users'), user);
      return user;
    } catch (error) {
      console.error("Error al crear el usuario:", error);
      throw new Error("No se pudo crear el usuario");
    }
  };
  
  export const sendEmail = async (toEmail) => {
    try {
      console.log(`Enviar correo a: ${toEmail}`);
      return true;
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      return false;
    }
  };