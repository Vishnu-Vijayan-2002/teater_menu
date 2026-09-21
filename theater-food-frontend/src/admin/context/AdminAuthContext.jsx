import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { getAdminSession, saveAdminSession, clearAdminSession } from "../../utils/adminSession";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const session = getAdminSession();
    if (session?.user) return session.user;
    if (session?.email) return { uid: session.uid || "demo-admin-uid", email: session.email };
    return null;
  });

  const [adminData, setAdminData] = useState(() => {
    const session = getAdminSession();
    return session?.role ? session : null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have an existing local admin session, resolve loading quickly
    const localSession = getAdminSession();
    if (localSession?.user) {
      setUser(localSession.user);
      setAdminData(localSession);
      setLoading(false);
    }

    let unsubscribe = () => {};

    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            // Only clear if there's no local demo session
            const currentSession = getAdminSession();
            if (!currentSession?.isDemo && !currentSession?.user) {
              setUser(null);
              setAdminData(null);
            }
            setLoading(false);
            return;
          }

          const userRef = doc(db, "users", firebaseUser.uid);
          const snapshot = await getDoc(userRef);

          if (!snapshot.exists()) {
            // Fallback for Firebase authenticated user without explicit Firestore document
            const defaultData = {
              role: "THEATER_ADMIN",
              active: true,
              email: firebaseUser.email,
            };
            setUser(firebaseUser);
            setAdminData(defaultData);
            saveAdminSession({ user: { uid: firebaseUser.uid, email: firebaseUser.email }, ...defaultData });
            setLoading(false);
            return;
          }

          const data = snapshot.data();
          const allowedRoles = ["SUPER_ADMIN", "THEATER_ADMIN", "STAFF"];

          if (!allowedRoles.includes(data.role) || data.active === false) {
            await auth.signOut();
            clearAdminSession();
            setUser(null);
            setAdminData(null);
            setLoading(false);
            return;
          }

          setUser(firebaseUser);
          setAdminData(data);
          saveAdminSession({ user: { uid: firebaseUser.uid, email: firebaseUser.email }, ...data });
        } catch (error) {
          console.warn("Admin Firestore authorization check note:", error.message);
          // Don't log out if demo session exists
          const current = getAdminSession();
          if (current?.user) {
            setUser(current.user);
            setAdminData(current);
          }
        } finally {
          setLoading(false);
        }
      });
    } catch (err) {
      console.warn("Firebase Auth listener initialization error:", err);
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const loginDemo = (email = "admin@cinema.com") => {
    const demoUser = { uid: "demo-admin-uid", email };
    const demoData = {
      role: "THEATER_ADMIN",
      active: true,
      email,
      name: "Cinema Administrator",
      isDemo: true,
    };
    saveAdminSession({ user: demoUser, ...demoData });
    setUser(demoUser);
    setAdminData(demoData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await auth.signOut();
    } catch {
      // ignore
    }
    clearAdminSession();
    setUser(null);
    setAdminData(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminData,
        loading,
        isAuthenticated: !!user,
        loginDemo,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}