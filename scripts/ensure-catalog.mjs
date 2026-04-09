#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const manifestPath = join(process.cwd(), "public", "catalog", "manifest.json");
const buildScriptPath = join(process.cwd(), "scripts", "build-catalog.mjs");

function hasValidCatalog() {
  if (!existsSync(manifestPath)) {
    return false;
  }

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    return Number(manifest?.totalProducts ?? 0) >= 100000 && Number(manifest?.allShardCount ?? 0) > 0;
  } catch {
    return false;
  }
}

if (hasValidCatalog()) {
  console.log("📚 Existing static catalog detected. Skipping rebuild.");
  process.exit(0);
}

console.log("📚 Static catalog missing or invalid. Generating before build...");

const result = spawnSync(process.execPath, [buildScriptPath], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
