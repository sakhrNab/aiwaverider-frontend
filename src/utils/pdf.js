// Minimal client-side PDF helper using the browser Print-to-PDF.
// It hides non-print regions and sets the filename via document.title
// so that most browsers pre-fill the Save As dialog with our name.

/**
 * Print a specific element as PDF using the browser's print dialog.
 * The page defines `.print-area` for the region to print and `.no-print` for controls.
 *
 * @param {string} desiredFileBaseName Base name without extension (e.g., "media-kit_2025-08-23")
 */
export function printCurrentPageAsPdf(desiredFileBaseName) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const originalTitle = document.title;
  try {
    if (desiredFileBaseName && typeof desiredFileBaseName === 'string') {
      // Many browsers use document.title as the default filename for Save as PDF
      document.title = desiredFileBaseName;
    }
    window.print();
  } finally {
    // Restore to avoid confusing navigation/history/title
    document.title = originalTitle;
  }
}

/**
 * Utility to format today to YYYY-MM-DD for filenames.
 * @returns {string}
 */
export function getTodayIsoDate() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}


