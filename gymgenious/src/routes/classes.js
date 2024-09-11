import { firestore } from '../firebase-config'; 
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';

export const getClasses = async () => {
  try {
    const classesCollection = collection(firestore, 'classes');
    const classesSnapshot = await getDocs(classesCollection);
    const classesList = classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return classesList;
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    throw new Error("No se pudo obtener las clases");
  }
};

export const createClass = async (newClass) => {
  try {
    const classData = { ...newClass};
    await addDoc(collection(firestore, 'classes'), classData);
    return classData;
  } catch (error) {
    console.error("Error al crear la clase:", error);
    throw new Error("No se pudo crear la clase");
  }
};
