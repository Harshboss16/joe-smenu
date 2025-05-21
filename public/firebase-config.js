
// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDm3ztXe-iBM3xL2FeYilB-T31_MoL5zEU",
  authDomain: "harshv3-a4a52.firebaseapp.com",
  projectId: "harshv3-a4a52",
  storageBucket: "harshv3-a4a52.firebasestorage.app",
  messagingSenderId: "437981305123",
  appId: "1:437981305123:web:2bd5be6b51c3c8824e9496"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
