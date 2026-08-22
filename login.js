import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    firebaseConfig
} from "./firebase-config.js";


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider =
    new GoogleAuthProvider();


const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const message =
    document.getElementById("authMessage");

const loginButton =
    document.getElementById("loginButton");

const googleButton =
    document.getElementById("googleLogin");


/* ================================
   EMAIL LOGIN
================================ */

loginForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        message.textContent = "";

        loginButton.disabled = true;

        loginButton.textContent =
            "Logging in...";


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            window.location.href =
                "index.html";

        }

        catch (error) {

            console.error(error);

            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                message.textContent =
                    "Incorrect email or password.";

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                message.textContent =
                    "No account exists with this email.";

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                message.textContent =
                    "Incorrect password.";

            }

            else {

                message.textContent =
                    error.message;

            }

        }

        finally {

            loginButton.disabled = false;

            loginButton.textContent =
                "Log in";

        }

    }
);


/* ================================
   GOOGLE LOGIN
================================ */

googleButton.addEventListener(
    "click",
    async () => {

        message.textContent = "";

        googleButton.disabled = true;

        googleButton.textContent =
            "Connecting to Google...";


        try {

            const result =
                await signInWithPopup(
                    auth,
                    googleProvider
                );


            const user =
                result.user;


            /*
             * Check whether the user
             * already has a JustTypeWeb
             * Firestore profile.
             */

            const userRef =
                doc(
                    db,
                    "users",
                    user.uid
                );


            const userSnapshot =
                await getDoc(userRef);


            if (
                userSnapshot.exists()
            ) {

                window.location.href =
                    "index.html";

            }

            else {

                /*
                 * New Google user.
                 *
                 * We'll create their
                 * JustTypeWeb profile
                 * in the next step.
                 */

                window.location.href =
                    "complete-profile.html";

            }

        }

        catch (error) {

            console.error(
                "GOOGLE LOGIN ERROR:",
                error
            );


            if (
                error.code ===
                "auth/popup-closed-by-user"
            ) {

                message.textContent =
                    "Google login was cancelled.";

            }

            else if (
                error.code ===
                "auth/popup-blocked"
            ) {

                message.textContent =
                    "Your browser blocked the Google login popup.";

            }

            else if (
                error.code ===
                "auth/account-exists-with-different-credential"
            ) {

                message.textContent =
                    "This email already has an account using another login method. Log in with that method first.";

            }

            else {

                message.textContent =
                    error.message;

            }

        }

        finally {

            googleButton.disabled = false;

            googleButton.textContent =
                "Continue with Google";

        }

    }
);
