import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    firebaseConfig
} from "./firebase-config.js";


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);


const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const authMessage =
    document.getElementById("authMessage");

const loginButton =
    document.getElementById("loginButton");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    authMessage.textContent = "";

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

        authMessage.textContent =
            "Unable to log in. Check your email and password.";

    }

    finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Log in";

    }

});
