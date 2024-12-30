export async function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  // Generate an RSA key pair
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048, // Key size
      publicExponent: new Uint8Array([1, 0, 1]), // Common value
      hash: { name: "SHA-256" } // Hash algorithm
    },
    true, // Whether the key is extractable
    ["encrypt", "decrypt"] // Key usages
  );

  // Export keys to Base64 for storage
  const publicKeyBuffer = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKeyBuffer = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  // Convert the ArrayBuffer to a Base64 string
  const publicKey = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuffer)));
  const privateKey = btoa(String.fromCharCode(...new Uint8Array(privateKeyBuffer)));

  return {
    publicKey,
    privateKey
  };
}
