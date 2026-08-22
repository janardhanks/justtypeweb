import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { auth } from "./firebase/auth.js";
import { db } from "./firebase/database.js";

const form = document.getElementById("signupForm");
const message = document.getElementById("authMessage");
const button = document.getElementById("signupButton");

form?.addEventListener("submit", async e => {
  e.preventDefault();
  const displayName = document.getElementById("displayName").value.trim();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  message.textContent = "";
  button.disabled = true;
  button.textContent = "Creating account...";

  try {
    if (!/^[a-z0-9_]{3,20}$/.test(username)) throw new Error("USERNAME_INVALID");
    const usernameRef = doc(db, "usernames", username);
    if ((await getDoc(usernameRef)).exists()) throw new Error("USERNAME_EXISTS");

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    const counterRef = doc(db, "system", "userCounter");
    const number = await runTransaction(db, async tx => {
      const snap = await tx.get(counterRef);
      const next = snap.exists() ? Number(snap.data().value || 0) + 1 : 1;
      tx.set(counterRef, { value: next });
      return next;
    });

    const tag = String(number).padStart(4, "0");
    const fullUsername = `${username}#${tag}`;

    await setDoc(usernameRef, { uid: user.uid, username, tag, createdAt: serverTimestamp() });
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid, displayName, username, tag, fullUsername,
      email, bio: "", role: "user", createdAt: serverTimestamp()
    });
    await updateProfile(user, { displayName });
    location.href = "index.html";
  } catch (error) {
    console.error("JustTypeWeb signup:", error);
    const map = {
      USERNAME_INVALID: "Username must be 3–20 characters using letters, numbers or underscore.",
      USERNAME_EXISTS: "That username is already taken.",
      "auth/email-already-in-use": "This email already has an account. Try logging in.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "permission-denied": "Firestore permission denied. Check your Firestore rules.",
      "auth/unauthorized-domain": "Add janardhanks.github.io to Firebase Authentication → Settings → Authorized domains."
    };
    message.textContent = map[error.message] || map[error.code] || error.message || "Account creation failed.";
  } finally {
    button.disabled = false;
    button.textContent = "Create account";
  }
});
