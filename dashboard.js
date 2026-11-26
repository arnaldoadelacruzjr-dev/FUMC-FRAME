import { db } from "./firebase-config.js";
import { collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const framesContainer = document.getElementById("frames");
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pageUrl = (file, id) => { const u = new URL(file, window.location.href); if (id) u.searchParams.set("id", id); return u.href; };

async function loadFrames() {
  framesContainer.innerHTML = '<div class="empty">Loading Frames...</div>';
  try {
    const snap = await getDocs(collection(db, "frames"));
    if (snap.empty) { framesContainer.innerHTML = '<div class="empty">No Frames Found</div>'; return; }
    const grid = document.createElement("div"); grid.className = "frames-grid";
    snap.forEach(frameDoc => {
      const data = frameDoc.data() || {}; const id = frameDoc.id;
      const card = document.createElement("div"); card.className = "frame-card";
      const img = document.createElement("img"); img.className = "frame-image"; img.src = data.image || ""; img.alt = data.title || "Frame";
      const content = document.createElement("div"); content.className = "frame-content";
      const title = document.createElement("div"); title.className = "frame-title"; title.textContent = data.title || "Untitled Frame";
      const buttons = document.createElement("div"); buttons.className = "frame-buttons";
      const addButton = (label, cls, action) => { const b=document.createElement("button"); b.textContent=label; b.className=cls; b.addEventListener("click",action); buttons.appendChild(b); };
      const shareLink = pageUrl("frame.html", id);
      addButton("View", "view-btn", () => location.href=pageUrl("view.html", id));
      addButton("Copy Link", "copy-btn", async () => { try { await navigator.clipboard.writeText(shareLink); alert("Frame link copied!"); } catch { prompt("Copy this frame link:", shareLink); } });
      addButton("Edit", "edit-btn", () => location.href=pageUrl("newframe.html", id));
      addButton("Delete", "delete-btn", async () => { if (!confirm("Delete this frame?")) return; try { await deleteDoc(doc(db,"frames",id)); await loadFrames(); } catch(e) { alert("Unable to delete frame: "+e.message); } });
      content.append(title,buttons); card.append(img,content); grid.appendChild(card);
    });
    framesContainer.replaceChildren(grid);
  } catch (error) {
    console.error(error); framesContainer.innerHTML = `<div class="empty">Error Loading Frames<br><br>${esc(error.message)}</div>`;
  }
}
loadFrames();
