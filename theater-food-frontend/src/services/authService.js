import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { saveAdminSession, clearAdminSession } from "../utils/adminSession";

export async function loginAdmin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDocRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      saveAdminSession({ uid: user.uid, email: user.email, ...data });
      return { user, data };
    }

    // Default admin role fallback if document isn't explicitly configured in Firestore
    const defaultData = { role: "THEATER_ADMIN", active: true, email: user.email };
    saveAdminSession({ uid: user.uid, ...defaultData });
    return { user, data: defaultData };
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
    clearAdminSession();
  } catch (error) {
    console.error("Admin logout error:", error);
    throw error;
  }
}
