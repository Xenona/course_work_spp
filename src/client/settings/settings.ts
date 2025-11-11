 

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
  const delBtn = document.getElementById("delBtn") as HTMLButtonElement;
  
  const back = document.getElementById('backLink') as HTMLLinkElement;
  const parts = location.pathname.split('/').filter(Boolean);
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

 delBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  const confirmed = confirm(
    '⚠️  Are you sure you want to permanently delete this board?\n' +
    'All board data, updates and settings will be lost.',
  );
  if (!confirmed) return;

  delBtn.disabled = true;
  delBtn.textContent = '⏳ Deleting…';
  msgDiv.textContent = '';
  msgDiv.style.color = '';

  try {
    const boardId = getBoardUuid();
    const resp = await fetch(`/boards/${boardId}/settings/del`, {
      method: 'POST',              
      credentials: 'include',      
      headers: { 'Accept': 'application/json' },
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err.error ?? `Server returned ${resp.status}`);
    }

    const data = await resp.json();
    console.log('🗑️ Delete response:', data);


    msgDiv.textContent = '✅ Board deleted – returning to board list…';
    msgDiv.style.color = 'green';

    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
  } catch (err: any) {
    console.error('❌ Delete failed:', err);
    msgDiv.textContent = `❌ ${err.message}`;
    msgDiv.style.color = 'red';
    delBtn.disabled = false;
    delBtn.textContent = 'Delete board';
  }
});

  saveBtn.addEventListener("click", async (ev) => {
    ev.preventDefault();
    saveBtn.disabled = true;
    saveBtn.textContent = "⏳ Saving…";
    msgDiv.textContent = "";
    try {
      const updated = await saveSettings(boardId);
      fillForm(updated);
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