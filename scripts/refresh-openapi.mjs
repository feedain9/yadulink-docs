#!/usr/bin/env node
/**
 * Refresh the committed OpenAPI snapshot from production.
 *
 * The API reference is generated from `openapi/yadulink-v1.json` rather than
 * fetched at build time: a documentation build must not fail because the app is
 * mid-deploy, and committing the schema makes every contract change visible in
 * a diff before it reaches the published reference.
 *
 *   npm run refresh:openapi
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const SOURCE = process.env.YADULINK_OPENAPI_URL || "https://app.yadulink.com/api/v1/openapi.json";
const TARGET = join(dirname(fileURLToPath(import.meta.url)), "..", "openapi", "yadulink-v1.json");

const response = await fetch(SOURCE, { redirect: "follow", headers: { Accept: "application/json" } });
if (!response.ok) {
  console.error(`Refusing to overwrite the snapshot: ${SOURCE} answered ${response.status}.`);
  process.exit(1);
}

const spec = await response.json();
if (!spec?.paths || !spec?.info?.version) {
  console.error("Refusing to overwrite the snapshot: the response is not an OpenAPI document.");
  process.exit(1);
}

await writeFile(TARGET, `${JSON.stringify(spec, null, 2)}\n`, "utf8");
console.log(`Wrote ${Object.keys(spec.paths).length} paths from ${SOURCE}.`);
