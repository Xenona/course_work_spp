import type { ApiResult } from "@/menu/Api";
import { checkAuthAndRedirect } from "./login";

export async function registerUser(
  username: string,
  email: string,
  password: string
): Promise<ApiResult> {
  try {
    const response = await fetch("/u/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: username, email, password }),
    });

    const payload = (await response.json()) as
      | { success: true; user: unknown }
      | { error: string };

    if (response.ok && "success" in payload && payload.success) {
      return {
        success: true,
        message: "User created successfully.",
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

function validateFields(
  username: string,
  email: string,
  password: string,
  confirm: string
): string | null {
  if (!username.trim() || !email.trim() || !password || !confirm) return "All fields are required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (password.length < 6) return "Password should be at least 6 characters.";
  if (password !== confirm) return "Passwords do not match.";
  return null;
}

async function handleRegisterClick(): Promise<void> {
  const username = (document.getElementById("reg-username") as HTMLInputElement).value;
  const email = (document.getElementById("reg-email") as HTMLInputElement).value;
  const password = (document.getElementById("reg-password") as HTMLInputElement).value;
  const confirm = (document.getElementById("reg-confirm") as HTMLInputElement).value;

  const msgDiv = document.getElementById("reg-msg") as HTMLDivElement;
  const btn = document.getElementById("registerBtn") as HTMLButtonElement;

  const validationError = validateFields(username, email, password, confirm);
  if (validationError) {
    msgDiv.textContent = ` ${validationError}`;
    msgDiv.style.color = "orange";
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳…";

  const result = await registerUser(username, email, password);

  btn.disabled = false;
  btn.textContent = "Register";

  msgDiv.textContent = result.message;
  msgDiv.style.color = result.success ? "green" : "red";

  if (result.success) {
    setTimeout(() => {
      window.location.href = "./l";
    }, 1500);
  }
}

function bootstrap(): void {
  const btn = document.getElementById("registerBtn");
  if (!btn) return console.error("Register button not found.");
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    void handleRegisterClick();
  });
}
checkAuthAndRedirect()

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}