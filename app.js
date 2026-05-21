const allowedVideoExtensions = [".mp4", ".webm", ".mov", ".m4v", ".ogv"];
const blockedHosts = ["youtube.com", "youtu.be", "tiktok.com", "instagram.com"];

const form = document.querySelector("#download-form");
const input = document.querySelector("#video-url");
const result = document.querySelector("#result");
const statusText = document.querySelector("#status-text");
const fileName = document.querySelector("#file-name");
const downloadLink = document.querySelector("#download-link");

function getFileName(url) {
  const pathName = decodeURIComponent(url.pathname);
  const name = pathName.split("/").filter(Boolean).pop();
  return name || "video";
}

function hasAllowedExtension(url) {
  const pathName = url.pathname.toLowerCase();
  return allowedVideoExtensions.some((extension) => pathName.endsWith(extension));
}

function isBlockedPlatform(url) {
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  return blockedHosts.some((blockedHost) => host === blockedHost || host.endsWith(`.${blockedHost}`));
}

function showResult(message, name, href, isError = false) {
  result.hidden = false;
  statusText.textContent = message;
  statusText.classList.toggle("error", isError);
  fileName.textContent = name;
  downloadLink.hidden = isError;

  if (!isError) {
    downloadLink.href = href;
    downloadLink.download = name;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let url;

  try {
    url = new URL(input.value.trim());
  } catch {
    showResult("ลิงก์ไม่ถูกต้อง", "กรุณาตรวจสอบ URL แล้วลองใหม่", "#", true);
    return;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    showResult("รองรับเฉพาะ HTTP หรือ HTTPS", "กรุณาใช้ลิงก์เว็บมาตรฐาน", "#", true);
    return;
  }

  if (isBlockedPlatform(url)) {
    showResult(
      "ไม่รองรับการดึงไฟล์จากแพลตฟอร์มนี้",
      "ใช้เครื่องมือดาวน์โหลดหรือ export ทางการของแพลตฟอร์มนั้นแทน",
      "#",
      true,
    );
    return;
  }

  if (!hasAllowedExtension(url)) {
    showResult(
      "ยังไม่พบไฟล์วิดีโอโดยตรง",
      "ลิงก์ควรลงท้ายด้วย .mp4, .webm, .mov, .m4v หรือ .ogv",
      "#",
      true,
    );
    return;
  }

  showResult("พร้อมดาวน์โหลด", getFileName(url), url.href);
});
