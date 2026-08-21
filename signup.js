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
    serverTimestamp,
    runTransaction
} from
"https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


import {
    firebaseConfig
} from "./firebase-config.js";


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


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
             * Create Firebase Auth account
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
             * Generate JustTypeWeb number
             *
             * 1 → 0001
             * 2 → 0002
             * etc.
             */

            const counterReference =
                doc(
                    db,
                    "system",
                    "userCounter"
                );


            const number =
                await runTransaction(
                    db,
                    async transaction => {

                        const snapshot =
                            await transaction.get(
                                counterReference
                            );


                        let nextNumber = 1;


                        if (snapshot.exists()) {

                            nextNumber =
                                (
                                    snapshot.data()
                                        .value || 0
                                ) + 1;

                        }


                        transaction.set(
                            counterReference,
                            {
                                value: nextNumber
                            }
                        );


                        return nextNumber;

                    }
                );


            const tag =
                String(number)
                    .padStart(4, "0");


            const fullUsername =
                `${username}#${tag}`;


            /*
             * Save public profile
             */

            await setDoc(
                doc(db, "users", user.uid),
                {

                    uid: user.uid,

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
             * Update Firebase profile
             */

            await updateProfile(
                user,
                {
                    displayName:
                        displayName
                }
            );


            /*
             * Successful signup
             */

            window.location.href =
                "index.html";

        }

        catch (error) {

            console.error(error);


            if (
                error.code ===
                "auth/email-already-in-use"
            ) {

                message.textContent =
                    "This email already has an account.";

            }

            else if (
                error.code ===
                "auth/weak-password"
            ) {

                message.textContent =
                    "Please choose a stronger password.";

            }

            else {

                message.textContent =
                    "Account creation failed. Please try again.";

            }

        }

        finally {

            button.disabled = false;

            button.textContent =
                "Create account";

        }

    }
);
