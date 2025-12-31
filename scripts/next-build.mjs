import { spawnSync } from "node:child_process"
import { createRequire } from "node:module"
import fs from "node:fs/promises"
import path from "node:path"

const require = createRequire(import.meta.url)

const nextBin = require.resolve("next/dist/bin/next")

const buildsRoot = ".next-builds"
await fs.mkdir(buildsRoot, { recursive: true })
const distDir = path.join(buildsRoot, `${Date.now()}-${process.pid}`)
const currentFile = path.join(buildsRoot, ".current")

const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: distDir },
})

const status = result.status ?? 1
if (status === 0) {
  await fs.writeFile(currentFile, distDir, "utf8")
}

process.exit(status)
