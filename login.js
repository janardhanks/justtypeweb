import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";
import { auth } from "./firebase/auth.js";
import { db } from "./firebase/database.js";

const form = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("authMessage");
const loginButton = document.getElementById("loginButton");
const googleButton = document.getElementById("googleLogin");

function showError(error) {
  console.error("JustTypeWeb login:", error);
  const map = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account exists with this email.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/popup-closed-by-user": "Google login was cancelled.",
    "auth/popup-blocked": "Your browser blocked the Google login popup.",
    "auth/unauthorized-domain": "Add janardhanks.github.io to Firebase Authentication → Settings → Authorized domains."
  };
  message.textContent = map[error.code] || error.message || "Login failed.";
}

form?.addEventListener("submit", async e => {
  e.preventDefault();
  message.textContent = "";
  loginButton.disabled = true;
  loginButton.textContent = "Logging in...";
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value);
    location.href = "index.html";
  } catch (error) {
    showError(error);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Log in";
  }
});

googleButton?.addEventListener("click", async () => {
  message.textContent = "";
  googleButton.disabled = true;
  googleButton.textContent = "Connecting to Google...";
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const result = await signInWithPopup(auth, provider);
    const profile = await getDoc(doc(db, "users", result.user.uid));
    location.href = profile.exists() ? "index.html" : "complete-profile.html";
  } catch (error) {
    showError(error);
  } finally {
    googleButton.disabled = false;
    googleButton.textContent = "Continue with Google";
  }
});
