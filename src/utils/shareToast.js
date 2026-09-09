/**
 * Copy text to clipboard with fallback for non-secure or older browser environments
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('navigator.clipboard.writeText failed, falling back to execCommand', e);
    }
  }

  // Fallback
  return new Promise((resolve, reject) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      textArea.remove();
      if (successful) resolve(true);
      else reject(new Error('execCommand failed'));
    } catch (err) {
      textArea.remove();
      reject(err);
    }
  });
}

/**
 * Display a floating pill toast notification on screen
 */
export function showShareToast(message = "Link copied to clipboard!") {
  const existing = document.getElementById("share-toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "share-toast-notification";
  toast.style.cssText = `
    position: fixed;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #18181b;
    color: #ffffff;
    padding: 0.75rem 1.4rem;
    border-radius: 9999px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 999999;
    border: 1px solid rgba(255, 255, 255, 0.18);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    font-family: inherit;
  `;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 320);
  }, 2500);
}
