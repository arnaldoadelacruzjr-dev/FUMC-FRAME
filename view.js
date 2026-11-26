import { db } from "./firebase-config.js";
import { doc, getDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
const preview=document.getElementById("preview"), frameTitle=document.getElementById("frameTitle"), frameLink=document.getElementById("frameLink");
const copyBtn=document.getElementById("copyBtn"), openBtn=document.getElementById("openBtn"), editBtn=document.getElementById("editBtn"), deleteBtn=document.getElementById("deleteBtn");
const frameId=new URLSearchParams(location.search).get("id");
const pageUrl=(file,id)=>{const u=new URL(file,location.href);if(id)u.searchParams.set("id",id);return u.href;};
let publicLink="";
async function loadFrame(){
 if(!frameId){frameTitle.textContent="Frame Not Found";return;}
 try{const snap=await getDoc(doc(db,"frames",frameId));if(!snap.exists()){frameTitle.textContent="Frame Not Found";return;}
 const data=snap.data();frameTitle.textContent=data.title||"Untitled Frame";preview.src=data.image||"";publicLink=pageUrl("frame.html",frameId);frameLink.value=publicLink;
 }catch(e){frameTitle.textContent="Unable to load frame";alert(e.message);}}
copyBtn.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(publicLink);alert("Link Copied!");}catch{prompt("Copy this link:",publicLink);}});
openBtn.addEventListener("click",()=>window.open(publicLink,"_blank","noopener"));
editBtn.addEventListener("click",()=>location.href=pageUrl("newframe.html",frameId));
deleteBtn.addEventListener("click",async()=>{if(!confirm("Delete this frame?"))return;try{await deleteDoc(doc(db,"frames",frameId));alert("Frame Deleted!");location.href=pageUrl("dashboard.html");}catch(e){alert(e.message);}});
loadFrame();
