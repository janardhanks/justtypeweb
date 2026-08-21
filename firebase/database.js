import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
    app
} from "./auth.js";

const db = getFirestore(app);

export async function createPost(userId, username, content) {

    const post = {

        userId: userId,

        username: username,

        content: content,

        createdAt: serverTimestamp(),

        likesCount: 0,

        commentsCount: 0

    };

    return await addDoc(
        collection(db, "posts"),
        post
    );
}


export async function getPosts() {

    const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    const snapshot =
        await getDocs(postsQuery);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}
