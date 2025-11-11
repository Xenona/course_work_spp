export async function checkAuthAndRedirectClient(): Promise<boolean> {
  try {
    const resp = await fetch("/auth/verify", {
      method: "GET",
      credentials: "include",      
      headers: {
        "Accept": "application/json",
      },
    });

    if (resp.ok) {
      return true;
    }

  } catch (e) {
    console.warn(" Auth check failed (network error):", e);
  }

  document.body.classList.add("auth‑redirect");
  setTimeout(() => (window.location.href = "/"), 150);
  return false;
}