export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Read the file as an ArrayBuffer for a more robust conversion
    reader.readAsArrayBuffer(file);
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        const buffer = reader.result;
        // Convert ArrayBuffer to a binary string
        const bytes = new Uint8Array(buffer);
        let binary = '';
        // btoa can't handle multi-byte characters, so we process byte by byte
        bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        // Base64-encode the binary string
        try {
          const base64String = window.btoa(binary);
          resolve(base64String);
        } catch (error) {
          reject(new Error("Failed to base64-encode the image file."));
        }
      } else {
        reject(new Error("FileReader did not return an ArrayBuffer."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
