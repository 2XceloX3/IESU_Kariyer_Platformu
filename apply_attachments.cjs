const fs = require('fs');
const path = require('path');

const components = [
  'CMSAnnouncements.jsx',
  'CMSJobs.jsx',
  'CMSFeatured.jsx',
  'CMSMentorship.jsx'
];

components.forEach(file => {
  const filePath = path.join(__dirname, 'src/components/admin', file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Add import
  if (!content.includes('AttachmentUploader')) {
    content = content.replace(
      "import MediaUploader from './MediaUploader';",
      "import MediaUploader from './MediaUploader';\nimport AttachmentUploader from './AttachmentUploader';"
    );
    // if there is no MediaUploader, just add it below AdminCMSLayout
    if (!content.includes('AttachmentUploader')) {
      content = content.replace(
        "import AdminCMSLayout from './AdminCMSLayout';",
        "import AdminCMSLayout from './AdminCMSLayout';\nimport AttachmentUploader from './AttachmentUploader';"
      );
    }
  }

  // 2. Add FileText icon if missing
  if (!content.includes('FileText')) {
    content = content.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, FileText } from 'lucide-react';");
  }

  // 3. Add to state
  if (!content.includes('attachmentData:')) {
    content = content.replace(/status: '([^']+)'\s*\}/g, "status: '$1',\n    attachmentData: null,\n    attachmentName: ''\n  }");
  }

  // 4. Add to form view (before the status select or description)
  if (!content.includes('<AttachmentUploader')) {
    const uploaderCode = `\n      <AttachmentUploader 
        label="Ekli Dosya (PDF/DOC) (İsteğe Bağlı)" 
        fileData={form.attachmentData} 
        fileName={form.attachmentName} 
        onFileChange={(data, name) => setForm({...form, attachmentData: data, attachmentName: name})} 
      />\n      `;
      
    if (content.includes('<MediaUploader')) {
      content = content.replace(/(<MediaUploader[^>]+>(\s*.*\s*)*?<\/MediaUploader>)/, "$1" + uploaderCode);
    } else {
      content = content.replace(/(<div>\s*<label[^>]*>Durum<\/label>)/, uploaderCode + "$1");
    }
  }

  // 5. Add to preview view
  if (!content.includes('form.attachmentData')) {
    const previewCode = `
        {form.attachmentData && (
          <div className="flex items-center gap-2 mb-4 text-xs font-bold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 mt-3">
            <FileText size={14} className="shrink-0" />
            <span className="truncate">{form.attachmentName}</span>
          </div>
        )}\n        `;
        
    content = content.replace(/(<div className="mt-auto">)/, previewCode + "$1");
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
