import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyApaioDo5m9FPv_2DpVX3twAEwroIrxQ8Y",
  authDomain: "snaplink-7ae14.firebaseapp.com",
  projectId:  "snaplink-7ae14",
  storageBucket: "snaplink-7ae14.firebasestorage.app",
  messagingSenderId: "1076577814722",
  appId: "1:1076577814722:web:c3a65397422f89735a135b",
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }

