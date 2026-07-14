import html2pdf from 'html2pdf.js';

/**
 * Generates a PDF from a specified HTML element ID.
 * @param {string} elementId - The ID of the HTML element to capture.
 * @param {string} filename - The desired filename for the downloaded PDF.
 */
export const exportPDF = (elementId, filename = 'Özgeçmiş.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found.`);
    if (window.toast) window.toast.error("PDF oluşturulamadı: Hedef alan bulunamadı.");
    return;
  }

  // Optional: Add a class for print-specific styles right before generating
  element.classList.add('pdf-export-mode');

  const opt = {
    margin:       10,
    filename:     filename,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  if (window.toast) window.toast.success("PDF hazırlanıyor, lütfen bekleyin...");
  
  html2pdf().set(opt).from(element).save().then(() => {
    if (window.toast) window.toast.success("PDF başarıyla indirildi.");
    element.classList.remove('pdf-export-mode');
  }).catch(err => {
    console.error("PDF Generation Error:", err);
    if (window.toast) window.toast.error("PDF oluşturulurken bir hata oluştu.");
    element.classList.remove('pdf-export-mode');
  });
};
