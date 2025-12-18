import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Development-only global error capture and overlay to aid debugging
if (process.env.NODE_ENV !== "production") {
  (window as any).__errors = [] as any[];

  const overlayId = "dev-error-overlay";
  const ensureOverlay = () => {
    let el = document.getElementById(overlayId);
    if (!el) {
      el = document.createElement("div");
      el.id = overlayId;
      el.style.position = "fixed";
      el.style.left = "10px";
      el.style.top = "10px";
      el.style.zIndex = "999999";
      el.style.maxWidth = "calc(100% - 20px)";
      el.style.maxHeight = "80vh";
      el.style.overflow = "auto";
      el.style.background = "rgba(0,0,0,0.85)";
      el.style.color = "white";
      el.style.padding = "12px";
      el.style.borderRadius = "8px";
      el.style.fontFamily = "monospace";
      el.style.fontSize = "12px";
      el.style.whiteSpace = "pre-wrap";
      el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.6)";
      el.style.backdropFilter = "blur(4px)";
      document.body.appendChild(el);
    }
    return el as HTMLDivElement;
  };

  const renderOverlay = () => {
    const el = ensureOverlay();
    const items = (window as any).__errors || [];
    if (items.length === 0) {
      el.style.display = "none";
      return;
    }
    el.style.display = "block";
    const html = items
      .map((it: any, idx: number) => {
        const time = new Date(it.time).toLocaleTimeString();
        return `--- ${idx + 1} @ ${time} ---\n${
          it.message || it.stack || JSON.stringify(it)
        }\n`;
      })
      .join("\n\n");

    el.textContent = html;
  };

  window.addEventListener("error", (ev) => {
    const err = ev.error || ev.message || "Unknown error";
    (window as any).__errors.push({
      time: Date.now(),
      message: String(err),
      stack: err && err.stack ? err.stack : "",
    });
    console.error("[global error captured]", err);
    renderOverlay();
  });

  window.addEventListener("unhandledrejection", (ev) => {
    const err = ev.reason || "Unhandled rejection";
    (window as any).__errors.push({
      time: Date.now(),
      message: String(err),
      stack: err && err.stack ? err.stack : "",
    });
    console.error("[unhandled rejection captured]", err);
    renderOverlay();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
