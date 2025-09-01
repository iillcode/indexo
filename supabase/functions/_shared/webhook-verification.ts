export async function verifyLemonSqueezySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // LemonSqueezy uses HMAC-SHA256 for webhook signatures
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const data = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // LemonSqueezy sends the signature as hex
    const receivedSignature = signature.toLowerCase();
    const expectedSignature = computedSignature.toLowerCase();

    return receivedSignature === expectedSignature;
  } catch (error) {
    console.error("Error verifying LemonSqueezy signature:", error);
    return false;
  }
}

// Keep the original Stripe verification for backward compatibility
export async function verifyStripeSignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const data = encoder.encode(body);

    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Extract signature from Stripe format (e.g., "v1=abc123,t=1234567890")
    const stripeSignature = signature
      .split(",")
      .find((part) => part.startsWith("v1="))
      ?.split("=")[1];

    if (!stripeSignature) {
      return false;
    }

    return stripeSignature === computedSignature;
  } catch (error) {
    console.error("Error verifying Stripe signature:", error);
    return false;
  }
}
