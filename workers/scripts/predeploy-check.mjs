import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function fail(message) {
  console.error(`[workers doctor] ${message}`);
  process.exit(1);
}

const wranglerToml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
const databaseIdMatch = wranglerToml.match(/^database_id\s*=\s*"([^"]+)"/m);
const databaseId = databaseIdMatch?.[1]?.trim();

if (!databaseId || databaseId === "placeholder-replace-with-actual-id") {
  fail("wrangler.toml の database_id が未設定です。Cloudflare D1 の実IDに差し替えてください。");
}

const hasApiToken = Boolean(process.env.CLOUDFLARE_API_TOKEN || process.env.CF_API_TOKEN);
const hasWranglerSession = existsSync(join(homedir(), ".wrangler", "config", "default.toml"));

if (!hasApiToken && !hasWranglerSession) {
  fail("Cloudflare 認証が見つかりません。`wrangler login` か `CLOUDFLARE_API_TOKEN` を設定してください。");
}

console.log("[workers doctor] Cloudflare 認証と D1 database_id の基本チェックを通過しました。");
