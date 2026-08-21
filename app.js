/* =====================================
   JUSTTYPEWEB — FRONTEND
===================================== */


/* =====================================
   CHARACTER COUNTER
===================================== */

const postInput =
    document.getElementById("postInput");

const characterCount =
    document.getElementById("characterCount");


if (postInput) {

    postInput.addEventListener(
        "input",
        () => {

            const count =
                postInput.value.length;

            characterCount.textContent =
                `${count} / 500`;

        }
    );

}


/* =====================================
   LIKE BUTTONS
===================================== */

document
    .querySelectorAll(".like-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const number =
                    button.querySelector(
                        "span:last-child"
                    );

                const icon =
                    button.querySelector(
                        "span:first-child"
                    );

                let count =
                    parseInt(
                        number.textContent
                    ) || 0;


                if (
                    button.classList.contains(
                        "liked"
                    )
                ) {

                    button.classList.remove(
                        "liked"
                    );

                    count--;

                    icon.textContent = "♡";

                } else {

                    button.classList.add(
                        "liked"
                    );

                    count++;

                    icon.textContent = "♥";

                }


                number.textContent =
                    count;

            }
        );

    });


/* =====================================
   CREATE DEMO POST
===================================== */

const postButton =
    document.getElementById("postButton");


const postsContainer =
    document.getElementById("posts");


function createPost(text) {

    if (!text.trim()) {

        return;

    }


    const post =
        document.createElement("article");


    post.className =
        "post";


    post.innerHTML = `

        <div class="post-avatar">
            J
        </div>

        <div class="post-content">

            <div class="post-header">

                <div>

                    <strong>
                        Janardhan K S
                    </strong>

                    <span class="username">
                        @janardhan#0001
                    </span>

                    <span class="post-time">
                        · now
                    </span>

                </div>

                <button class="more-button">
                    •••
                </button>

            </div>


            <p class="post-text">
                ${escapeHTML(text)}
            </p>


            <div class="post-actions">

                <button class="post-action like-button">

                    <span>♡</span>

                    <span>0</span>

                </button>


                <button class="post-action">

                    <span>◯</span>

                    <span>0</span>

                </button>


                <button class="post-action">

                    <span>↗</span>

                    <span>Share</span>

                </button>

            </div>

        </div>
    `;


    postsContainer.prepend(post);


    const likeButton =
        post.querySelector(
            ".like-button"
        );


    likeButton.addEventListener(
        "click",
        () => {

            const number =
                likeButton.querySelector(
                    "span:last-child"
                );

            const icon =
                likeButton.querySelector(
                    "span:first-child"
                );


            let count =
                parseInt(
                    number.textContent
                ) || 0;


            if (
                likeButton.classList
                    .contains("liked")
            ) {

                likeButton.classList
                    .remove("liked");

                count--;

                icon.textContent = "♡";

            } else {

                likeButton.classList
                    .add("liked");

                count++;

                icon.textContent = "♥";

            }


            number.textContent =
                count;

        }
    );

}


/* =====================================
   MAIN POST BUTTON
===================================== */

if (postButton) {

    postButton.addEventListener(
        "click",
        () => {

            const text =
                postInput.value.trim();


            if (!text) {

                postInput.focus();

                return;

            }


            createPost(text);


            postInput.value = "";

            characterCount.textContent =
                "0 / 500";

        }
    );

}


/* =====================================
   MODAL
===================================== */

const modal =
    document.getElementById(
        "composerModal"
    );


const openComposer =
    document.getElementById(
        "openComposer"
    );


const mobileCompose =
    document.getElementById(
        "mobileCompose"
    );


const closeComposer =
    document.getElementById(
        "closeComposer"
    );


const modalInput =
    document.getElementById(
        "modalPostInput"
    );


const modalPostButton =
    document.getElementById(
        "modalPostButton"
    );


function showComposer() {

    modal.classList.add("show");

    setTimeout(
        () => modalInput.focus(),
        100
    );

}


function hideComposer() {

    modal.classList.remove("show");

}


if (openComposer) {

    openComposer.addEventListener(
        "click",
        showComposer
    );

}


if (mobileCompose) {

    mobileCompose.addEventListener(
        "click",
        showComposer
    );

}


if (closeComposer) {

    closeComposer.addEventListener(
        "click",
        hideComposer
    );

}


if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                hideComposer();

            }

        }
    );

}


if (modalPostButton) {

    modalPostButton.addEventListener(
        "click",
        () => {

            const text =
                modalInput.value.trim();


            if (!text) {

                modalInput.focus();

                return;

            }


            createPost(text);


            modalInput.value = "";

            hideComposer();

        }
    );

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent = value;

    return div.innerHTML;

}


/* =====================================
   KEYBOARD SHORTCUT
===================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            hideComposer();

        }

    }
);
