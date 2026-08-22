import {
  getFirestore, collection, addDoc, getDocs, query, orderBy,
  serverTimestamp, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { app } from "./auth.js";

export const db = getFirestore(app);

export async function createPost(userId, username, content, displayName = "") {
  return addDoc(collection(db, "posts"), {
    userId, username, displayName, content,
    createdAt: serverTimestamp(),
    likesCount: 0, commentsCount: 0
  });
}

export async function getPosts() {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function getUserProfile(uid) {
  const snapshot = await getDoc(doc(db, "users", uid));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
}

export async function saveUserProfile(uid, profile) {
  return setDoc(doc(db, "users", uid), profile, { merge: true });
}
