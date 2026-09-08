import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const mdPath = path.resolve('docs/NYAYAAI_Platform_Manual_and_Guide.md');
const htmlPath = path.resolve('docs/NYAYAAI_Platform_Manual_and_Guide.html');
const pdfPath = path.resolve('docs/NYAYAAI_Platform_Manual_and_Guide.pdf');

const md = fs.readFileSync(mdPath, 'utf8');

// Basic markdown to HTML converter tailored for this manual
function convertMdToHtml(markdown) {
  const lines = markdown.split('\n');
  let html = [];
  let inTable = false;
  let inList = false;
  let listType = 'ul';
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code blocks
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html.push('</code></pre>');
        inCodeBlock = false;
      } else {
        html.push('<pre><code>');
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) {
      html.push(escapeHtml(line));
      continue;
    }

    // Tables
    if (line.trim().startsWith('|')) {
      if (line.includes('---')) continue; // separator line
      const cells = line.split('|').map(c => c.trim()).filter((c, idx, arr) => idx > 0 && idx < arr.length - 1);
      if (!inTable) {
        html.push('<table><thead><tr>');
        cells.forEach(c => html.push(`<th>${parseInline(c)}</th>`));
        html.push('</tr></thead><tbody>');
        inTable = true;
      } else {
        html.push('<tr>');
        cells.forEach(c => html.push(`<td>${parseInline(c)}</td>`));
        html.push('</tr>');
      }
      continue;
    } else if (inTable) {
      html.push('</tbody></table>');
      inTable = false;
    }

    // Lists
    if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
      if (!inList || listType !== 'ul') {
        if (inList) html.push(`</${listType}>`);
        html.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      html.push(`<li>${parseInline(line.trim().substring(2))}</li>`);
      continue;
    } else if (/^\d+\.\s/.test(line.trim())) {
      if (!inList || listType !== 'ol') {
        if (inList) html.push(`</${listType}>`);
        html.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      const text = line.trim().replace(/^\d+\.\s/, '');
      html.push(`<li>${parseInline(text)}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      html.push(`</${listType}>`);
      inList = false;
    }

    // Headers
    if (line.startsWith('# ')) {
      html.push(`<h1 class="doc-title">${parseInline(line.substring(2))}</h1>`);
      continue;
    }
    if (line.startsWith('## ')) {
      html.push(`<h2 class="section-title">${parseInline(line.substring(3))}</h2>`);
      continue;
    }
    if (line.startsWith('### ')) {
      html.push(`<h3 class="subsection-title">${parseInline(line.substring(4))}</h3>`);
      continue;
    }
    if (line.startsWith('#### ')) {
      html.push(`<h4>${parseInline(line.substring(5))}</h4>`);
      continue;
    }

    if (line.trim() === '---') {
      html.push('<hr class="divider" />');
      continue;
    }

    if (line.trim() !== '') {
      html.push(`<p>${parseInline(line)}</p>`);
    }
  }

  if (inTable) html.push('</tbody></table>');
  if (inList) html.push(`</${listType}>`);

  return html.join('\n');
}

function parseInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const bodyHtml = convertMdToHtml(md);

const completeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>NYAYAAI Platform Manual & Feature Guide</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.6;
      font-size: 10pt;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }
    .cover-banner {
      background: linear-gradient(135deg, #0b192c 0%, #1e3a8a 100%);
      color: #ffffff;
      padding: 36px 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      border-bottom: 4px solid #c5a059;
    }
    .cover-badge {
      display: inline-block;
      background: rgba(197, 160, 89, 0.2);
      color: #fef08a;
      border: 1px solid #c5a059;
      padding: 4px 14px;
      border-radius: 20px;
      font-size: 8.5pt;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 15px;
    }
    .cover-banner h1 {
      font-size: 26pt;
      margin: 0 0 8px 0;
      color: #ffffff;
      letter-spacing: 1px;
    }
    .cover-tagline {
      font-size: 12pt;
      color: #c5a059;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .cover-desc {
      font-size: 10pt;
      color: #cbd5e1;
      max-width: 650px;
      line-height: 1.5;
    }
    .cover-footer-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.15);
      font-size: 8.5pt;
      color: #94a3b8;
    }

    h1.doc-title {
      display: none; /* Handled by cover banner */
    }
    h2.section-title {
      font-size: 14pt;
      color: #0b192c;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 12px;
      page-break-after: avoid;
    }
    h3.subsection-title {
      font-size: 11pt;
      color: #1e3a8a;
      margin-top: 18px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }
    p {
      margin-top: 0;
      margin-bottom: 10px;
      text-align: justify;
    }
    ul, ol {
      margin-top: 0;
      margin-bottom: 12px;
      padding-left: 20px;
    }
    li {
      margin-bottom: 4px;
    }
    code {
      font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
      background: #f1f5f9;
      color: #0f172a;
      padding: 1px 4px;
      border-radius: 4px;
      font-size: 9pt;
    }
    pre {
      background: #0b192c;
      color: #f8fafc;
      padding: 12px 14px;
      border-radius: 8px;
      font-size: 8.5pt;
      line-height: 1.45;
      overflow-x: auto;
      page-break-inside: avoid;
      margin: 12px 0;
    }
    pre code {
      background: transparent;
      color: #f8fafc;
      padding: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background: #f8fafc;
      color: #0b192c;
      font-weight: 600;
      border-bottom: 2px solid #94a3b8;
    }
    tr:nth-child(even) td {
      background: #fdfdfd;
    }
    hr.divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 24px 0;
    }
    a {
      color: #1e3a8a;
      text-decoration: none;
    }
    .footer-disclaimer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #cbd5e1;
      font-size: 8pt;
      color: #64748b;
      text-align: center;
    }
  </style>
</head>
<body>

  <div class="cover-banner">
    <div class="cover-badge">Official Architecture & User Manual</div>
    <h1>NYAYAAI</h1>
    <div class="cover-tagline">Research. Analyze. Verify. Draft.</div>
    <div class="cover-desc">
      Comprehensive technical handbook, advocate user guide, and feature specification for the NYAYAAI Legal Intelligence Platform. Includes full dual-law compliance (BNS / BNSS / BSA vs IPC / CrPC / IEA), cloud deployment procedures, and ethical guidelines.
    </div>
    <div class="cover-footer-meta">
      <div><strong>Version:</strong> 1.0.0 Production Release &bull; <strong>Target Jurisdiction:</strong> Republic of India</div>
      <div><strong>Date:</strong> September 2026 &bull; <strong>Tech Stack:</strong> Next.js 14, TypeScript, Tailwind, Gemini</div>
    </div>
  </div>

  ${bodyHtml}

  <div class="footer-disclaimer">
    NYAYAAI AI-Powered Indian Legal Intelligence Platform &bull; Confidential & Proprietary Manual &bull; September 2026 &bull; Compliant with Bar Council of India Standards
  </div>

</body>
</html>`;

fs.writeFileSync(htmlPath, completeHtml, 'utf8');
console.log('Generated:', htmlPath);
