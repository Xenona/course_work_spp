import type { BoardInMenu, Settings } from '@/menu/Api'
import casandra from 'cassandra-driver'
import settings from "@/client/settings/settings.html"


export function extractBoardId(req: Bun.BunRequest): string | null {
  const pathname = new URL(req.url).pathname;
  const match = pathname.split('/')[2];
  console.log("serv",pathname)
  return match ? match : null;
}

export class SettingsManager {
  client: casandra.Client

  constructor(client: casandra.Client) {
    this.client = client
  }

  async getSetting(boardid: string): Promise<Settings> {
    const board = (await this.client.execute('SELECT * from board_list WHERE boardid=?', [boardid])).rows
    const setting_id = (board[0] as any as BoardInMenu).setting
    const b = await this.client.execute('SELECT * FROM settings WHERE settings_id=?', [setting_id])
    return b.rows.map((e) => ({
      settings_id: e.settings_id,
      description: e.description,
      name: e.name,
      private: e.private,
      theme: e.theme,
    }))[0]
  }

  async deleteBoard(boardId: string): Promise<boolean> {
    const boardResult = await this.client.execute(
      "SELECT * FROM board_list WHERE boardid = ?",
      [boardId],
    );

    if (boardResult.rowLength === 0) {
      return false;
    }

    const boardRow = boardResult.first() as unknown as BoardInMenu;
    const settingId = boardRow.setting;

    const statements = [
      {
        query: "DELETE FROM board_list WHERE boardid = ?",
        params: [boardId],
      },
      {
        query: "DELETE FROM settings WHERE settings_id = ?",
        params: [settingId],
      }
     
    ];

    try {
      await this.client.batch(
        statements.map((s) => ({
          query: s.query,
          params: s.params,
        })),
        { prepare: true }, 
      );
    } catch (err) {
      console.error("Failed to delete board:", err);
      throw new Error("Unable to delete board – see server logs");
    }

    return true;
  }


  async updateSettings(
    boardid: string,
    theme: boolean,
    isPrivate: boolean,
    description: string,
  ): Promise<Settings> {

    const board = (await this.client.execute('SELECT * from board_list WHERE boardid=?', [boardid])).rows
    const setting_id = (board[0] as any as BoardInMenu).setting

    await this.client.execute(
      `UPDATE settings
      SET theme = ?, private = ?, description = ?
      WHERE settings_id = ?`,
      [theme, isPrivate, description ?? "", setting_id]
    );

    return {
      settings_id: setting_id,
      description: description,
      private: isPrivate,
      theme: theme,
    };
  }

  getRoutes() {
    return {
      "/boards/:uuid/settings": settings,
      "/boards/:uuid/settings/del":async (req: Bun.BunRequest) => {
        const match = req.url.split('/')[4];
        console.log("DE:", match)
        if (!match) {
          return new Response(
            JSON.stringify({ error: "Invalid URL – board UUID missing" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        const boardId = match;

        try {
          const deleted = await this.deleteBoard(boardId);
          if (!deleted) {
            return new Response(
              JSON.stringify({ error: "Board not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          return new Response(
            JSON.stringify({ success: true, message: "Board removed" }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          );
        } catch (e) {
          console.error("Delete endpoint error:", e);
          return new Response(
            JSON.stringify({ error: "Failed to delete board" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
      "/boards/:uuid/settings/get": async (req: Bun.BunRequest) => {
        if (req.method !== "GET") {
          return new Response(
            JSON.stringify({ error: "Method not allowed – use GET" }),
            { status: 405, headers: { "Content-Type": "application/json" } },
          );
        }

        const boardId = extractBoardId(req);
        console.log("BBBBB", boardId)
        if (!boardId) {
          return new Response(
            JSON.stringify({ error: "Invalid URL; expected /board/<uuid>/settings" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const boardResult = await this.client.execute(
            "SELECT * FROM board_list WHERE boardid = ?",
            [boardId],
          );
          const boardRows = boardResult.rows as any as BoardInMenu[];
          if (boardRows.length === 0) {
            return new Response(
              JSON.stringify({ error: "Board not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          const settingId = boardRows[0].setting;

          const settingsResult = await this.client.execute(
            "SELECT * FROM settings WHERE settings_id = ?",
            [settingId],
          );

          const raw = settingsResult.rows[0];
          if (!raw) {
            return new Response(
              JSON.stringify({ error: "Settings record not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }

          const settings: Settings = {
            settings_id: raw.settings_id,
            description: raw.description ?? null,
            theme: raw.theme,
            private: raw.private,
          };

          return new Response(JSON.stringify(settings), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error(" getBoardSetting error:", err);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
      "/boards/:uuid/settings/upd": async (req: Bun.BunRequest) => {

        if (req.method !== "PATCH") {
          return new Response(
            JSON.stringify({ error: "Method not allowed – use PATCH" }),
            { status: 405, headers: { "Content-Type": "application/json" } },
          );
        }

        const boardId = extractBoardId(req);
        if (!boardId) {
          return new Response(
            JSON.stringify({ error: "Invalid URL; expected /board/<uuid>/settings" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const ct = req.headers.get("content-type") ?? "";
        if (!ct.includes("application/json")) {
          return new Response(
            JSON.stringify({ error: "Content-Type must be application/json" }),
            { status: 415, headers: { "Content-Type": "application/json" } },
          );
        }

        let payload: any;
        try {
          const txt = await req.text();
          payload = JSON.parse(txt);
        } catch {
          return new Response(
            JSON.stringify({ error: "Malformed JSON payload" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const { theme, private: isPrivate, description } = payload;

        if (typeof theme !== "boolean" || typeof isPrivate !== "boolean") {
          return new Response(
            JSON.stringify({ error: "`theme` and `private` must be booleans" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }
        if (
          description !== undefined &&
          description !== null &&
          typeof description !== "string"
        ) {
          return new Response(
            JSON.stringify({ error: "`description` must be a string, null or omitted" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const boardResult = await this.client.execute(
            "SELECT * FROM board_list WHERE boardid = ?",
            [boardId],
          );
          const boardRows = boardResult.rows as any as BoardInMenu[];
          if (boardRows.length === 0) {
            return new Response(
              JSON.stringify({ error: "Board not found" }),
              { status: 404, headers: { "Content-Type": "application/json" } },
            );
          }
          const settingId = boardRows[0].setting;

          await this.client.execute(
            `UPDATE settings
            SET theme = ?, private = ?, description = ?
          WHERE settings_id = ?`,
            [theme, isPrivate, description ?? "", settingId],
            { prepare: true },
          );

          const updated: Settings = {
            settings_id: settingId,
            theme,
            private: isPrivate,
            description: description ?? null,
          };

          return new Response(JSON.stringify(updated), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          console.error(`patchBoardSetting(${boardId}) error:`, err);
          return new Response(
            JSON.stringify({ error: "Internal server error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      }
    }
  }

}