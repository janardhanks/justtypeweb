import { initializeApp } from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    runTransaction,
    serverTimestamp
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    firebaseConfig
} from "./firebase-config.js";


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


const form =
    document.getElementById("signupForm");

const message =
    document.getElementById("authMessage");

const button =
    document.getElementById("signupButton");


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const displayName =
            document
                .getElementById("displayName")
                .value
                .trim();

        const username =
            document
                .getElementById("username")
                .value
                .trim()
                .toLowerCase();

        const email =
            document
                .getElementById("email")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;


        message.textContent = "";

        button.disabled = true;

        button.textContent =
            "Creating account...";


        try {

            /*
             * Validate username
             */

            if (!/^[a-z0-9_]+$/.test(username)) {

                throw new Error(
                    "USERNAME_INVALID"
                );

            }


            /*
             * Check username before creating account
             */

            const usernameRef =
                doc(
                    db,
                    "usernames",
                    username
                );


            const usernameSnapshot =
                await getDoc(usernameRef);


            if (usernameSnapshot.exists()) {

                throw new Error(
                    "USERNAME_EXISTS"
                );

            }


            /*
             * Create Firebase Authentication account
             */

            const credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );


            const user =
                credential.user;


            /*
             * Generate user number
             */

            const counterRef =
                doc(
                    db,
                    "system",
                    "userCounter"
                );


            const userNumber =
                await runTransaction(
                    db,
                    async (transaction) => {

                        const counterSnapshot =
                            await transaction.get(
                                counterRef
                            );


                        let nextNumber = 1;


                        if (
                            counterSnapshot.exists()
                        ) {

                            nextNumber =
                                (
                                    counterSnapshot
                                        .data()
                                        .value || 0
                                ) + 1;

                        }


                        transaction.set(
                            counterRef,
                            {
                                value: nextNumber
                            }
                        );


                        return nextNumber;

                    }
                );


            const tag =
                String(userNumber)
                    .padStart(4, "0");


            const fullUsername =
                `${username}#${tag}`;


            /*
             * Save username reservation
             */

            await setDoc(
                usernameRef,
                {
                    uid: user.uid,
                    username: username,
                    tag: tag,
                    createdAt:
                        serverTimestamp()
                }
            );


            /*
             * Save user profile
             */

            await setDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {

                    uid:
                        user.uid,

                    displayName:
                        displayName,

                    username:
                        username,

                    tag:
                        tag,

                    fullUsername:
                        fullUsername,

                    email:
                        email,

                    bio:
                        "",

                    role:
                        "user",

                    createdAt:
                        serverTimestamp()

                }
            );


            /*
             * Update Firebase Auth profile
             */

            await updateProfile(
                user,
                {
                    displayName:
                        displayName
                }
            );


            /*
             * Success
             */

            window.location.href =
                "index.html";

        }

        catch (error) {

            console.error(
                "JUSTTYPEWEB SIGNUP ERROR:",
                error
            );


            if (
                error.message ===
                "USERNAME_EXISTS"
            ) {

                message.textContent =
                    "That username is already taken.";

            }

            else if (
                error.message ===
                "USERNAME_INVALID"
            ) {

                message.textContent =
                    "Username can only contain letters, numbers and underscore.";

            }

            else if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message.textContent =
                    "This email already has an account. Try logging in.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message.textContent =
                    "Password must be at least 6 characters.";

            }

            else if (
                error.code ===
                "permission-denied"
            ) {

                message.textContent =
                    "Firestore permission denied. Check your Firestore rules.";

            }

            else {

                message.textContent =
                    `Error: ${error.message}`;

            }

        }

        finally {

            button.disabled = false;

            button.textContent =
                "Create account";

        }

    }
);
