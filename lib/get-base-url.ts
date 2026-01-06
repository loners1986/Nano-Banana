function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

function isVercelHostname(hostname: string) {
  return hostname === "vercel.app" || hostname.endsWith(".vercel.app")
}

function safeOrigin(value: string | undefined) {
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol === "http:" || url.protocol === "https:") return url.origin
  } catch {
    // ignore
  }
  return null
}

function firstHeaderValue(value: string | null) {
  if (!value) return null
  const first = value.split(",")[0]?.trim()
  return first || null
}

export function getBaseUrl(req: Request) {
  const forwardedProto = firstHeaderValue(req.headers.get("x-forwarded-proto"))
  const forwardedHost = firstHeaderValue(req.headers.get("x-forwarded-host"))
  const host = forwardedHost || req.headers.get("host")

  const requestUrl = new URL(req.url)

  let proto = forwardedProto || requestUrl.protocol.replace(":", "") || "http"

  if (!forwardedProto && host) {
    const hostname = host.split(":")[0] || ""
    const hasExplicitPort = host.includes(":")
    if (!hasExplicitPort && !isLocalHostname(hostname) && process.env.NODE_ENV === "production") {
      proto = "https"
    }
  }

  const requestOrigin = host ? `${proto}://${host}` : requestUrl.origin

  const configuredOrigin =
    safeOrigin(process.env.SITE_URL) ||
    safeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ||
    safeOrigin(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined)

  const headerOrigin =
    safeOrigin(firstHeaderValue(req.headers.get("origin")) ?? undefined) ||
    safeOrigin(firstHeaderValue(req.headers.get("referer")) ?? undefined)

  const requestHost = new URL(requestOrigin).hostname
  const configuredHost = configuredOrigin ? new URL(configuredOrigin).hostname : null
  const headerHost = headerOrigin ? new URL(headerOrigin).hostname : null

  if (!configuredOrigin) {
    if (isLocalHostname(requestHost) && headerHost && !isLocalHostname(headerHost)) return headerOrigin!
    return requestOrigin
  }

  if (isVercelHostname(requestHost) && !isVercelHostname(configuredHost!)) return configuredOrigin
  if (isLocalHostname(requestHost) && !isLocalHostname(configuredHost!)) return configuredOrigin
  if (isLocalHostname(requestHost) && headerHost && !isLocalHostname(headerHost)) return headerOrigin!
  if (requestHost === configuredHost && new URL(requestOrigin).protocol !== new URL(configuredOrigin).protocol) {
    return configuredOrigin
  }

  return requestOrigin
}
