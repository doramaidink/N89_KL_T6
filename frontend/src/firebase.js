import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyAYOjTv_Y7qIXLt9o6AI9N3yTX4j_kF458",
  authDomain: "kltotnghiep-d429a.firebaseapp.com",
  projectId: "kltotnghiep-d429a",
  storageBucket: "kltotnghiep-d429a.firebasestorage.app",
  messagingSenderId: "198452594568",
  appId: "1:198452594568:web:ca4b1aa3661cff227a9c3d",
  measurementId: "G-JF425ZK7LC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);