import { inflateBase64 } from "../zlib";

export const isPenpaEditUrl = (url: string): boolean => {
  return url.startsWith("https://opt-pan.github.io/penpa-edit/");
};

export const isNumberlinkUrl = (url: string): boolean => {
  return url.includes("/p?numlin") || url.includes("/p?numberlink");
};

export const maybePreDecodeUrl = (url: string, puzzleKey?: string): string => {
  if (isPenpaEditUrl(url)) {
    const idx = url.indexOf("&p=");
    if (idx >= 0 && puzzleKey !== undefined) {
      const p = url.substring(idx + 3);
      const idx2 = p.indexOf("&");

      const encoded = idx2 >= 0 ? p.substring(0, idx2) : p;
      const decoded = inflateBase64(encoded);

      const key = puzzleKey;
      return key + "!penpa-edit-predecoded:" + decoded;
    } else {
      return "penpa-edit-predecoded:"; // TODO: handle case when puzzle key is not provided
    }
  } else {
    return url;
  }
};
