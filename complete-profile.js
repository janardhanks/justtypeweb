import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { auth } from "./firebase/auth.js";
import { db } from "./firebase/database.js";

let currentUser;
onAuthStateChanged(auth, user => {
  currentUser = user;
  if (!user) location.href = "login.html";
  else document.getElementById("displayName").value = user.displayName || "";
});

document.getElementById("profileForm").addEventListener("submit", async e => {
  e.preventDefault();
  const msg = document.getElementById("authMessage"), button = document.getElementById("saveButton");
  const displayName = document.getElementById("displayName").value.trim();
  const username = document.getElementById("username").value.trim().toLowerCase();
  msg.textContent = ""; button.disabled = true;
  try {
    if (!currentUser || !/^[a-z0-9_]{3,20}$/.test(username)) throw new Error("USERNAME_INVALID");
    const usernameRef = doc(db, "usernames", username);
    if ((await getDoc(usernameRef)).exists()) throw new Error("USERNAME_EXISTS");
    const counterRef = doc(db, "system", "userCounter");
    const number = await runTransaction(db, async tx => {
      const snap = await tx.get(counterRef);
      const next = snap.exists() ? Number(snap.data().value || 0) + 1 : 1;
      tx.set(counterRef, { value: next }); return next;
    });
    const tag = String(number).padStart(4, "0"), fullUsername = `${username}#${tag}`;
    await setDoc(usernameRef, {uid:currentUser.uid,username,tag,createdAt:serverTimestamp()});
    await setDoc(doc(db,"users",currentUser.uid),{uid:currentUser.uid,displayName,username,tag,fullUsername,email:currentUser.email||"",bio:"",role:"user",createdAt:serverTimestamp()});
    location.href = "index.html";
  } catch(error) {
    console.error(error);
    msg.textContent = error.message==="USERNAME_EXISTS" ? "That username is already taken." :
      error.message==="USERNAME_INVALID" ? "Username must be 3–20 characters using letters, numbers or underscore." :
      error.message || "Could not save profile.";
  } finally { button.disabled=false; }
});
