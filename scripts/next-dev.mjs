import { spawn } from "node:child_process"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)
const nextBin = require.resolve("next/dist/bin/next")

const args = process.argv.slice(2)
while (args[0] === "--") args.shift()

const hasPortArg = args.some(
  (arg) => arg === "-p" || arg === "--port" || arg.startsWith("--port=")
)
if (!hasPortArg && process.env.npm_config_port) {
  args.push("--port", process.env.npm_config_port)
}

const child = spawn(process.execPath, [nextBin, "dev", ...args], {
  stdio: "inherit",
  env: process.env,
})

process.on("SIGINT", () => child.kill("SIGINT"))
process.on("SIGTERM", () => child.kill("SIGTERM"))

child.on("exit", (code) => process.exit(code ?? 1))
