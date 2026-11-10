document.addEventListener("click", async (event) => {
  const header = event.target.closest?.("h2.anchor[id], h3.anchor[id], h4.anchor[id]");
  if (!header || event.target.closest("button, a:not(.hash-link)") || !navigator.clipboard) {
    return;
  }

  const url = new URL(window.location.href);
  url.hash = header.id;

  try {
    await navigator.clipboard.writeText(url.href);
  } catch {
    return;
  }

  const popup = document.createElement("div");
  popup.className = "copy-popup";
  popup.textContent = "Ссылка скопирована";
  popup.setAttribute("role", "status");
  document.body.appendChild(popup);
  header.classList.add("clicked");

  setTimeout(() => header.classList.remove("clicked"), 1500);
  setTimeout(() => popup.remove(), 3000);
});
