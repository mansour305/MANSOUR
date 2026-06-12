let registered = false;

export function registerPwaServiceWorker(): void {
  if (registered || typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  registered = true;

  window.addEventListener("load", () => {
    const swUrl = new URL("sw.js", window.location.href);
    const scope = new URL("./", window.location.href).pathname;

    navigator.serviceWorker
      .register(swUrl, { scope })
      .then((registration) => registration.update())
      .catch(() => {
        // Service worker registration is best effort.
      });
  });
}
