document.addEventListener("DOMContentLoaded", async () => {
  const notepad = document.querySelector(".notepad");

  const dbRequest = indexedDB.open("shimmerDB", 1);

  dbRequest.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("notes")) {
      db.createObjectStore("notes", { keyPath: "id" });
    }
  };

  dbRequest.onsuccess = (event) => {
    const db = event.target.result;

    const transaction = db.transaction("notes", "readonly");
    const store = transaction.objectStore("notes");
    const getRequest = store.get(1);

    getRequest.onsuccess = () => {
      if (getRequest.result) {
        notepad.innerHTML = getRequest.result.content;
      }
    };

    notepad.addEventListener("input", () => {
      const transaction = db.transaction("notes", "readwrite");
      const store = transaction.objectStore("notes");
      store.put({ id: 1, content: notepad.innerHTML });
    });

    notepad.addEventListener("paste", () => {
      setTimeout(() => {
        const transaction = db.transaction("notes", "readwrite");
        const store = transaction.objectStore("notes");
        store.put({ id: 1, content: notepad.innerHTML });
      }, 0);
    });
  };

  dbRequest.onerror = (event) => {
    console.error("Error opening database:", event.target.errorCode);
  };
});
