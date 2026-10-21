const controlChars = /[\u0000-\u001f\u007f]/g

// Keep plain text safe for display and LocalStorage. React still escapes it at render time.
export function sanitizeText(value, maxLength = 500) {
  return String(value ?? '').replace(controlChars, '').replace(/[<>]/g, '').trim().slice(0, maxLength)
}

export function createOrderId(existingIds = []) {
  if (!globalThis.crypto?.getRandomValues) throw new Error('A secure browser context is required to create an order.')
  const existing=new Set(existingIds.map(id=>String(id).replace(/^#/, '').toUpperCase()))
  for(let attempt=0;attempt<20;attempt++){
    const bytes = new Uint32Array(2)
    globalThis.crypto.getRandomValues(bytes)
    const value=(BigInt(bytes[0])<<32n)|BigInt(bytes[1])
    const id=`#AH-${(value%1000000000000n).toString().padStart(12,'0')}`
    if(!existing.has(id.slice(1)))return id
  }
  throw new Error('Could not generate a unique order reference. Please try again.')
}
