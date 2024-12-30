export async function decryptData(encryptedData: string, privateKeyBase64: string): Promise<string> {
    // Decode the Base64 private key
    const privateKeyBuffer = Uint8Array.from(atob(privateKeyBase64), (c) => c.charCodeAt(0));
    const privateKey = await window.crypto.subtle.importKey(
        "pkcs8",
        privateKeyBuffer.buffer,
        {
            name: "RSA-OAEP",
            hash: { name: "SHA-256" },
        },
        false, // Key is not extractable
        ["decrypt"]
    );

    // Decode the Base64 encrypted data
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encryptedBuffer.buffer
    );

    // Decode the decrypted ArrayBuffer to a string
    return new TextDecoder().decode(decryptedBuffer);
}
