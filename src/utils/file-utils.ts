export const base64ToFile = (base64: string, fileName: string): File => {
  const arr = base64.split(",");
  const mimeTypeMatch = arr[0].match(/:(.*?);/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `${fileName}.png`, { type: mimeType });
};

export const fileToBase64 = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
