const clients = new Set()

export function addClient(res) {
  clients.add(res)
  return () => clients.delete(res)
}

export function broadcast(type, payload = {}) {
  const data = `event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`
  for (const res of clients) res.write(data)
}
