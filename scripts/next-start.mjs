import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import fs from "node:fs/promises"
import path from "node:path"

const require = createRequire(import.meta.url)

const nextBin = require.resolve("next/dist/bin/next")
const buildsRoot = ".next-builds"
const currentFile = path.join(buildsRoot, ".current")

let distDir = process.env.NEXT_DIST_DIR
if (!distDir) {
  try {
    distDir = (await fs.readFile(currentFile, "utf8")).trim()
  } catch {
    distDir = ".next"
  }
}

const result = spawnSync(process.execPath, [nextBin, "start"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: distDir },
})

process.exit(result.status ?? 1)
