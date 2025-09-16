// src/utils/scriptLoader.js
export const loadScript = (id, src) => {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve(); // Already loaded
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

export const removeScript = (id) => {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
};
