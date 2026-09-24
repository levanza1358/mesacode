import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const packagePath = resolve(import.meta.dirname, "../package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const version = packageJson.version.match(/^(\d+)\.(\d+)\.(\d+)$/);

if (!version) {
  throw new Error(`Unsupported package version: ${packageJson.version}`);
}

packageJson.version = `${version[1]}.${version[2]}.${Number(version[3]) + 1}`;
await writeFile(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
console.log(`Mesa Code version: ${packageJson.version}`);
