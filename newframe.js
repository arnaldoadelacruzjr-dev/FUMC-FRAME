import { db } from "./firebase-config.js";
import { collection, addDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const CLOUD_NAME = "dgpdrr83v";
const UPLOAD_PRESET = "frame_upload";
const title = document.getElementById("title");
const frameFile = document.getElementById("frameFile");
const preview = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const status = document.getElementById("status");
const frameId = new URLSearchParams(location.search).get("id");
let imageUrl = "";

frameFile.addEventListener("change", () => {
  const file = frameFile.files?.[0]; if (!file) return;
  if (!file.type.startsWith("image/")) { status.textContent="Please choose an image file."; return; }
  preview.src = URL.createObjectURL(file); preview.style.display="block";
});

async function uploadToCloudinary(file) {
  const formData = new FormData(); formData.append("file",file); formData.append("upload_preset",UPLOAD_PRESET);
  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {method:"POST",body:formData});
  const data = await response.json();
  if (!response.ok || !data.secure_url) throw new Error(data.error?.message || "Image upload failed. Check the Cloudinary upload preset.");
  return data.secure_url;
}

async function loadFrame() {
  try {
    const snap=await getDoc(doc(db,"frames",frameId));
    if (!snap.exists()) { status.textContent="Frame not found."; saveBtn.disabled=true; return; }
    const data=snap.data(); title.value=data.title || ""; imageUrl=data.image || "";
    if(imageUrl){preview.src=imageUrl;preview.style.display="block";}
    saveBtn.textContent="Update Frame";
  } catch(e) { status.textContent="Unable to load frame: "+e.message; }
}

saveBtn.addEventListener("click", async () => {
  try {
    if (!title.value.trim()) { status.textContent="Please enter a frame title."; return; }
    saveBtn.disabled=true; saveBtn.textContent="Saving..."; status.textContent="";
    if(frameFile.files?.[0]) imageUrl=await uploadToCloudinary(frameFile.files[0]);
    if(!imageUrl) throw new Error("Please upload a frame image.");
    const payload={title:title.value.trim(),image:imageUrl,updatedAt:new Date()};
    if(frameId) await updateDoc(doc(db,"frames",frameId),payload);
    else await addDoc(collection(db,"frames"),{...payload,createdAt:new Date()});
    status.textContent="Frame saved successfully!";
    setTimeout(()=>location.href=new URL("dashboard.html",location.href).href,900);
  } catch(e) { console.error(e); status.textContent=e.message; saveBtn.disabled=false; saveBtn.textContent=frameId?"Update Frame":"Save Frame"; }
});
if(frameId) loadFrame();
