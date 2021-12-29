import {
  collection,
  getFirestore,
  getDocs,
  query,
  where,
} from 'firebase/firestore/lite';
import {app} from '../utils/firebase';

// export const saveData = async (dataCollection, data) => {};

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

// import {db} from '../utils/firebase';
// import {getDocs, collection, addDoc} from 'firebase/firestore';

// export const saveData = async (dataCollection, data) => {
//   db.settings({
//     timestampsInSnapshots: true,
//   });
//   try {
//     const docRef = await addDoc(collection(db, dataCollection), data);
//     console.log('Document written with ID: ', docRef.id);
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// };

// export const fetchData = async collectionName => {
//   //   const data = {success: null, error: null};
//   const citiesCol = collection(db, collectionName);
//   const citySnapshot = await getDocs(citiesCol);
//   const cityList = citySnapshot.docs.map(doc => doc.data());
//   return cityList;
// };

// export const fetchData = async collectionName => {
//   const data = {success: null, error: null};
//   const querySnapshot = await getDocs(collection(db, collectionName));
//   const fetchedData = [];
//   querySnapshot.forEach(doc => {
//     fetchedData.push(doc.data());
//     console.log(`${doc.id} => ${doc.data()}`);
//   });
//   data.success = fetchedData;
//   console.log('fetchedData', fetchedData);
//   return fetchedData;
// };

// export const fetchData = async collectionName => {
//   console.log('fetchData -------------------------');
//   const data = {success: null, error: null};
//   try {
//     const collectionRef = collection(db, collectionName);
//     const snapshot = await getDocs(collectionRef);
//     data.success = snapshot.docs.map(doc => {
//       const obj = doc.data();
//       obj.id = doc.id;
//       return obj;
//     });
//   } catch (e) {
//     console.error('Error fetching documents: ', e);
//     data.error = e;
//   }
//   return data;
// };

// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }
// export const saveData = async (collectionName, data) => {
//   const db = firebase.firestore();

//   db.settings({
//     timestampsInSnapshots: true,
//   });

//   const result = {success: null, error: null};
//   try {
//     const ref = await db.collection(collectionName).add({
//       data,
//     });
//     result.success = ref;
//   } catch (e) {
//     console.error('Error saving data to DB: ', e);
//     result.error = e;
//   }
//   return result;
// };
