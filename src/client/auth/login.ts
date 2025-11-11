import type { ApiResult } from "@/menu/Api";

export async function checkAuthAndRedirect(): Promise<void> {
  try {
    const resp = await fetch("/auth/verify", {
      method: "GET",
      credentials: "include",         
      headers: { "Accept": "application/json" },
    });

    if (resp.ok) {
      const data = await resp.json();

      console.log(data, resp.status)
      if (resp?.status) {
        console.log("Authenticated as", data.user?.sub);
        document.body.classList.add("auth‑redirect");
        setTimeout(() => (window.location.href = "/"), 200);
        return;
      }
    }

    console.log("No valid session – staying on the current page.");
  } catch (e) {
    console.error("Error while checking auth:", e);
  }
}


export async function checkCredentials(
  username: string,
  password: string
): Promise<ApiResult> {
  try {
    const response = await fetch("/u/check", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, password }),
    });

    const payload = (await response.json()) as
      | { valid: boolean }
      | { error: string };

    if (response.ok && "valid" in payload) {
      return {
        success: payload.valid,
        message: payload.valid ? "Credentials are valid." : "Invalid credentials.",
      };
    }

    const errMsg =
      "error" in payload
        ? payload.error
        : `Unexpected response (status ${response.status})`;

    return {
      success: false,
      message: errMsg,
    };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Unknown network error",
    };
  }
}
 
async function startOAuthLogin(): Promise<void> {
  const oauthStartUrl = "/auth/oauth2/start";

  window.location.assign(oauthStartUrl);
}


function onLoginSuccess(): void {
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
}

async function handleLoginClick(): Promise<void> {
  const username = (document.getElementById("username") as HTMLInputElement).value.trim();
  const password = (document.getElementById("password") as HTMLInputElement).value;
  const msgDiv = document.getElementById("msg") as HTMLDivElement;
  const btn = document.getElementById("loginBtn") as HTMLButtonElement;

  if (!username || !password) {
    msgDiv.textContent = "Both fields are required.";
    msgDiv.style.color = "orange";
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳…";

  const result = await checkCredentials(username, password);

  btn.disabled = false;
  btn.textContent = "Log in";

  msgDiv.textContent = result.message;
  msgDiv.style.color = result.success ? "green" : "red";

  if (result.success) onLoginSuccess();
}

function bootstrap(): void {
  const btn = document.getElementById("loginBtn");
  if (!btn) return console.error("Login button not found.");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    void handleLoginClick();
  });

  const oauthBtn = document.getElementById("oauthBtn");
  if (oauthBtn) {
    oauthBtn.addEventListener("click", (e) => {
      e.preventDefault();
      oauthBtn.setAttribute("disabled", "true");
      void startOAuthLogin();
    });
  } else {
    console.warn("OAuth button not found – you may have removed it from the markup.");
  }
}
checkAuthAndRedirect()
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}