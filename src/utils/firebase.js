import {initializeApp} from 'firebase/app';

import {firebaseConfig} from './firebaseConfig';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
