import crypto from 'crypto'

function generateCodeVerifier() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return base64URLEncode(array)
}

async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return base64URLEncode(new Uint8Array(digest))
}

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

const codeVerifier = generateCodeVerifier()
const codeChallenge = await generateCodeChallenge(codeVerifier)

console.log({codeVerifier, codeChallenge})

// {
//   codeVerifier: 'amtZSfpF8Pex1VOXx5k8UpmrMndUzW1AAvLC3O6oHhk',
//   codeChallenge: 'D3vUZv3_6E73bUCq1ft2MLZvLgbq3uEzkf0mi_WtQfY'
// }
