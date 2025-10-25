// Utility to normalize Google Drive share URLs to direct image links
export function normalizeDriveImage(url) {
  if (!url || typeof url !== "string") return url;
  url = url.trim();

  // If it's already a typical image URL, return as-is
  if (/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url)) return url;

  // Patterns for Google Drive
  // 1) https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch = url.match(
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  );
  if (fileIdMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
  }

  // 2) https://drive.google.com/open?id=FILE_ID or https://drive.google.com/?id=FILE_ID
  const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idParamMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${idParamMatch[1]}`;
  }

  // 3) direct uc links with export=download or export=view: convert to export=view
  if (url.includes("drive.google.com") && url.includes("uc?")) {
    return url.replace(/export=[^&]+/, "export=view");
  }

  // Fallback: return original URL
  return url;
}

export default normalizeDriveImage;
