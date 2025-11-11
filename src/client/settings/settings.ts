 

interface Settings {
  settings_id: string;
  theme: boolean;
  private: boolean;
  description: string | null;
}

function getBoardUuid(): string {
  const match = location.pathname.split('/')[2];
  console.log("CCC", location.pathname.split('/')[2])
  if (!match) {
    throw new Error("Board UUID not found in URL");
  }
  return match;
}

function endpoint(boardId: string, suffix: "get" | "upd"): string {
  return `/boards/${boardId}/settings/${suffix}`;
}

function fillForm(settings: Settings): void {
  (document.getElementById("theme") as HTMLInputElement).checked = !!settings.theme;
  (document.getElementById("private") as HTMLInputElement).checked = !!settings.private;
  (document.getElementById("description") as HTMLTextAreaElement).value =
    settings.description ?? "";
}

async function loadSettings(boardId: string): Promise<void> {
  console.log("UII", location.pathname, boardId)
  const resp = await fetch(endpoint(boardId, "get"), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to load settings");
  }

  const data: Settings = await resp.json();
  fillForm(data);
}

async function saveSettings(boardId: string): Promise<Settings> {
  const payload = {
    theme: (document.getElementById("theme") as HTMLInputElement).checked,
    private: (document.getElementById("private") as HTMLInputElement).checked,
    description: (document.getElementById("description") as HTMLTextAreaElement)
      .value.trim(),
  };

  const resp = await fetch(endpoint(boardId, "upd"), {
    method: "PATCH", 
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to save settings");
  }

  const saved: Settings = await resp.json();
  return saved;
}


async function bootstrap() {

  const msgDiv = document.getElementById("msg") as HTMLDivElement;
  const saveBtn = document.getElementById("saveBtn") as HTMLButtonElement;
  const back = document.getElementById('backLink') as HTMLLinkElement;
  const parts = location.pathname.split('/').filter(Boolean);   // ["boards","123e...", "settings"]
  parts.pop();
  if (back !== null) {
    console.log("NUNUNUNU")
    back!.href = '/' + parts.join('/');
  }

    
  let boardId: string;
  try {
    boardId = getBoardUuid();
    await loadSettings(boardId);
  } catch (e: any) {
    msgDiv.textContent = `❌ ${e.message}`;
    msgDiv.style.color = "red";
    console.error(e);
    return;
  }

  saveBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = "⏳ Saving…";
    msgDiv.textContent = "";
    try {
      const updated = await saveSettings(boardId);
      fillForm(updated); // keep UI in sync with what the server returned
      msgDiv.textContent = "✅ Settings saved!";
      msgDiv.style.color = "green";
    } catch (err: any) {
      msgDiv.textContent = `❌ ${err.message}`;
      msgDiv.style.color = "red";
      console.error(err);
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save";
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap);
} else {
  bootstrap();
}