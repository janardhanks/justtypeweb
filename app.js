import { auth, onAuthStateChanged } from "./firebase/auth.js";
import { createPost, getPosts, getUserProfile } from "./firebase/database.js";

const composer=document.getElementById("composerInput");
const modalInput=document.getElementById("modalInput");
const postButton=document.getElementById("postButton");
const modalPostButton=document.getElementById("modalPostButton");
const postsContainer=document.getElementById("posts");
const modal=document.getElementById("composeModal");
const characterCount=document.getElementById("characterCount");
const modalCharacterCount=document.getElementById("modalCharacterCount");
let currentUser=null,currentProfile=null;

const escapeHtml=s=>(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function count(input,out){if(input&&out)out.textContent=`${input.value.length}/500`;}
function time(ts){return ts?.toDate?ts.toDate().toLocaleString([],{dateStyle:"medium",timeStyle:"short"}):"just now";}

function render(posts){
  if(!postsContainer)return;
  postsContainer.innerHTML=posts.length?"":`<div class="post"><div class="post-content"><p class="post-text">No posts yet. Be the first to type.</p></div></div>`;
  posts.forEach(p=>{
    const name=p.displayName||p.username||"User", user=p.username||"user";
    const el=document.createElement("article"); el.className="post";
    el.innerHTML=`<div class="post-avatar">${escapeHtml(name[0].toUpperCase())}</div><div class="post-content">
      <div class="post-header"><div><strong>${escapeHtml(name)}</strong><span class="username">@${escapeHtml(user)}</span><span class="post-time">${escapeHtml(time(p.createdAt))}</span></div></div>
      <p class="post-text">${escapeHtml(p.content)}</p><div class="post-actions"><button class="post-action" type="button">♡ <span>${Number(p.likesCount||0)}</span></button><button class="post-action" type="button">💬 <span>${Number(p.commentsCount||0)}</span></button></div>
    </div>`; postsContainer.appendChild(el);
  });
}
async function load(){try{render(await getPosts());}catch(e){console.error(e);if(postsContainer)postsContainer.innerHTML=`<div class="post"><div class="post-content"><p class="post-text">Unable to load posts. Check Firestore rules.</p></div></div>`;}}
async function submit(input){
  if(!currentUser||!currentProfile){location.href="login.html";return;}
  const content=input?.value.trim(); if(!content)return;
  if(content.length>500){alert("Post must be 500 characters or less.");return;}
  if(postButton)postButton.disabled=true;if(modalPostButton)modalPostButton.disabled=true;
  try{await createPost(currentUser.uid,currentProfile.fullUsername||currentProfile.username||currentUser.email,content,currentProfile.displayName||currentUser.displayName||"User");input.value="";count(input,input===composer?characterCount:modalCharacterCount);if(modal)modal.classList.remove("show");await load();}
  catch(e){console.error(e);alert(`Post could not be saved: ${e.message}`);}
  finally{if(postButton)postButton.disabled=false;if(modalPostButton)modalPostButton.disabled=false;}
}
composer?.addEventListener("input",()=>count(composer,characterCount));
modalInput?.addEventListener("input",()=>count(modalInput,modalCharacterCount));
postButton?.addEventListener("click",()=>submit(composer));
modalPostButton?.addEventListener("click",()=>submit(modalInput));
document.querySelector(".compose-side-button")?.addEventListener("click",()=>modal?.classList.add("show"));
document.querySelector(".mobile-compose")?.addEventListener("click",()=>modal?.classList.add("show"));
document.getElementById("closeModal")?.addEventListener("click",()=>modal?.classList.remove("show"));
modal?.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("show");});

onAuthStateChanged(auth,async user=>{
  currentUser=user;
  if(!user){document.querySelectorAll(".composer,.compose-side-button,.mobile-compose").forEach(e=>{if(e)e.style.display="none";});return load();}
  try{currentProfile=await getUserProfile(user.uid);if(!currentProfile)return location.href="complete-profile.html";document.querySelectorAll(".composer,.compose-side-button,.mobile-compose").forEach(e=>{if(e)e.style.display="";});await load();}
  catch(e){console.error(e);await load();}
});
