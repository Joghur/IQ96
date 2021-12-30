import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  query,
  where,
} from 'firebase/firestore/lite';
import {app} from '../utils/firebase';

export const saveData = async (dataCollection, data) => {
  const db = getFirestore(app);
  const result = {success: null, error: null};
  try {
    const docRef = await addDoc(collection(db, dataCollection), data);
    console.log('Document written with ID: ', docRef.id);
    result.success = docRef.id;
  } catch (e) {
    console.error('Error adding document: ', e);
    result.error = e;
  }
  return result;
};

/**
 *
 * @param collectionName
 * @param where1st
 * @param where2nd
 * @param where3rd
 * @returns
 */
export const fetchData = async (
  collectionName,
  where1st,
  where2nd,
  where3rd,
) => {
  const db = getFirestore(app);

  const result = {success: null, error: null};

  try {
    const activitiesCollection = query(
      collection(db, collectionName),
      where(where1st, where2nd, where3rd),
    );
    const activitiesSnapshot = await getDocs(activitiesCollection);
    result.success = activitiesSnapshot.docs.map(doc => {
      const obj = doc.data();
      obj.id = doc.id;
      return obj;
    });
  } catch (e) {
    console.error('Error fetching documents: ', e);
    result.error = e;
  }
  return result;
};

/**
 *
 * @param collectionName
 * @returns
 */
export const fetchAll = async collectionName => {
  const db = getFirestore(app);

  const result = {success: null, error: null};

  try {
    const activitiesCollection = query(collection(db, collectionName));
    const activitiesSnapshot = await getDocs(activitiesCollection);
    result.success = activitiesSnapshot.docs.map(doc => {
      const obj = doc.data();
      obj.id = doc.id;
      return obj;
    });
  } catch (e) {
    console.error('Error fetching documents: ', e);
    result.error = e;
  }
  return result;
};
