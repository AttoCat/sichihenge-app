export const generateNonce = () => (btoa(
  String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
)
  .substring(0, 32));
