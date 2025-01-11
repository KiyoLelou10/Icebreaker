export async function encryptData(data: string, publicKeyBase64: string): Promise<string> {
    // Decode the Base64 public key
    const publicKeyBuffer = Uint8Array.from(atob(publicKeyBase64), (c) => c.charCodeAt(0));
    const publicKey = await window.crypto.subtle.importKey(
        "spki",
        publicKeyBuffer.buffer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" },
        },
        false, // Key is not extractable
        ["encrypt"]
    );

    // Encode the data to an ArrayBuffer
    const encodedData = new TextEncoder().encode(data);

    // Encrypt the data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "RSA-OAEP" },
        publicKey,
        encodedData
    );

    // Convert the encrypted ArrayBuffer to Base64
    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}
