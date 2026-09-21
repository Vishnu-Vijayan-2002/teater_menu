import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { mockMenu } from "../data/mockMenu";

const MENU_STORAGE_KEY = "cinema_custom_menu";

function getLocalMenu() {
  try {
    const raw = localStorage.getItem(MENU_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveLocalMenu(menu) {
  try {
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menu));
  } catch (err) {
    console.error("Failed to store local menu:", err);
  }
}

export async function fetchMenuItems() {
  try {
    const querySnapshot = await getDocs(collection(db, "menu"));
    if (!querySnapshot.empty) {
      const items = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      return items;
    }
  } catch (error) {
    console.warn("Firestore menu fetch unavailable, falling back to local/mock menu:", error.message);
  }

  // Fallback to local storage or bundled mock menu
  const local = getLocalMenu();
  if (local && local.length > 0) {
    return local;
  }

  saveLocalMenu(mockMenu);
  return mockMenu;
}

export async function saveMenuItem(item) {
  try {
    const docRef = doc(db, "menu", item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (error) {
    console.warn("Firestore menu write fallback to local storage:", error.message);
  }

  const items = getLocalMenu() || [...mockMenu];
  const idx = items.findIndex((i) => i.id === item.id);
  if (idx >= 0) {
    items[idx] = { ...items[idx], ...item };
  } else {
    items.unshift(item);
  }
  saveLocalMenu(items);
  return item;
}

export async function deleteMenuItem(id) {
  try {
    await deleteDoc(doc(db, "menu", id));
  } catch (error) {
    console.warn("Firestore menu delete fallback:", error.message);
  }

  const items = (getLocalMenu() || [...mockMenu]).filter((i) => i.id !== id);
  saveLocalMenu(items);
  return id;
}
