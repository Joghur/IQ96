import {
  collection,
  getFirestore,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
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
    console.error('saveData - Error adding document: ', e);
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
export const queryDocuments = async (
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
    console.error(
      'queryDocuments - Error fetching documents: ',
      'collectionName',
      collectionName,
      'where1st',
      where1st,
      'where2nd',
      where2nd,
      'where3rd',
      where3rd,
      e,
    );
    result.error = e;
  }
  return result;
};

/**
 *
 * @param collectionName
 * @returns
 */
export const fetchDocuments = async collectionName => {
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
    console.error('fetchDocuments - Error fetching documents: ', e);
    result.error = e;
  }
  return result;
};

export const deleteDocument = async (collectionName, docId) => {
  const db = getFirestore(app);

  const result = {success: null, error: null};

  try {
    await deleteDoc(doc(db, collectionName, docId));
    result.success = docId;
  } catch (e) {
    console.error('deleteDocuments - Error deleting document: ', e);
    result.error = e;
  }
  return result;
};

export const editDocument = async (collectionName, docId, data) => {
  const db = getFirestore(app);

  const result = {success: null, error: null};

  try {
    await updateDoc(doc(db, collectionName, docId), data);
    result.success = docId;
  } catch (e) {
    console.error('editDocument - Error updating documents: ', e);
    result.error = e;
  }
  return result;
};

export const fetchDocument = async (collectionName, docId) => {
  const db = getFirestore(app);

  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  const result = {success: null, error: null};

  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    result.success = docSnap.data();
  } else {
    console.log('No such document!');
  }

  //   try {
  //     const doc = await getDoc(doc(db, collectionName, docId));
  //     result.success = docId;
  //   } catch (e) {
  //     console.error('fetchDocument - Error updating documents: ', e);
  //     result.error = e;
  //   }
  return result;
};

export const chatDB = async () => {
  const db = getFirestore(app);
  return collection(db, 'chats');
};

// const docRef = doc(db, 'cities', 'SF');
// const docSnap = await getDoc(docRef);

// if (docSnap.exists()) {
//   console.log('Document data:', docSnap.data());
// } else {
//   // doc.data() will be undefined in this case
//   console.log('No such document!');
// }
