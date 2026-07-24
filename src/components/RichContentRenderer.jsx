import React from 'react';

export default function RichContentRenderer({ content }) {
  if (!content) return null;

  // Split content into blocks by double newlines or table boundaries
  const lines = content.split('\n');
  const blocks = [];
  let currentTable = null;
  let currentParagraph = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({ type: 'paragraph', text: currentParagraph.join('\n') });
      currentParagraph = [];
    }
  };

  const flushTable = () => {
    if (currentTable && currentTable.rows.length > 0) {
      blocks.push({ type: 'table', header: currentTable.header, rows: currentTable.rows });
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if line is part of a markdown table (starts and ends with | or contains multiple |)
    if (line.startsWith('|') && line.endsWith('|')) {
      flushParagraph();
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      // Skip separator lines like | :--- | :---: |
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }

      if (!currentTable) {
        currentTable = { header: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    if (!line) {
      flushParagraph();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      blocks.push({ type: 'h3', text: line.replace(/^###\s*/, '') });
    } else if (line.startsWith('#### ')) {
      flushParagraph();
      blocks.push({ type: 'h4', text: line.replace(/^####\s*/, '') });
    } else if (line.startsWith('---')) {
      flushParagraph();
      blocks.push({ type: 'hr' });
    } else {
      currentParagraph.push(line);
    }
  }

  flushParagraph();
  flushTable();

  const parseFormattedText = (text) => {
    if (!text) return '';
    // Replace **bold** text with <strong> elements
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-black text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
      {blocks.map((block, index) => {
        if (block.type === 'h3') {
          return (
            <h3 key={index} className="text-xl md:text-2xl font-black text-gray-900 tracking-tight mt-4 mb-2 pb-2 border-b border-gray-100 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#990000] rounded-full inline-block"></span>
              {parseFormattedText(block.text)}
            </h3>
          );
        }

        if (block.type === 'h4') {
          return (
            <h4 key={index} className="text-base md:text-lg font-bold text-red-900 mt-3 mb-1">
              {parseFormattedText(block.text)}
            </h4>
          );
        }

        if (block.type === 'hr') {
          return <hr key={index} className="border-gray-200 my-4" />;
        }

        if (block.type === 'table') {
          return (
            <div key={index} className="my-4 overflow-x-auto rounded-2xl border border-gray-200 shadow-md">
              <table className="w-full text-left text-xs md:text-sm border-collapse bg-white">
                <thead>
                  <tr className="bg-[#0A2342] text-white">
                    {block.header.map((cell, cIdx) => (
                      <th key={cIdx} className="px-4 py-3 font-extrabold uppercase tracking-wider border-b border-blue-900">
                        {parseFormattedText(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {block.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white hover:bg-red-50/40 transition-colors' : 'bg-gray-50/60 hover:bg-red-50/40 transition-colors'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-4 py-3 font-medium text-gray-800">
                          {parseFormattedText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p key={index} className="text-gray-700 font-medium whitespace-pre-line leading-relaxed">
            {parseFormattedText(block.text)}
          </p>
        );
      })}
    </div>
  );
}
