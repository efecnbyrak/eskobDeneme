type Seviye = 'info' | 'warn' | 'error'

function log(seviye: Seviye, msg: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'test') return
  const payload = {
    seviye,
    msg,
    t: new Date().toISOString(),
    ...(meta ?? {}),
  }
  const satir = JSON.stringify(payload)
  if (seviye === 'error') console.error(satir)
  else if (seviye === 'warn') console.warn(satir)
  else console.log(satir)
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
}
