const fs = require('fs');

let content = fs.readFileSync('signature.html', 'utf8');

// 1. Inject the UI Panel
const uiPanel = `
  <div class="customization-panel">
    <h3>⚙️ Signature Customization</h3>
    <div class="checkbox-grid">
      <label><input type="checkbox" checked onchange="toggleElement('sig-phone', this.checked)"> Cell Phone</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-email', this.checked)"> Email Address</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-web', this.checked)"> Website & Repo Links</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-socials', this.checked)"> Social Badges</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-portfolio', this.checked)"> Exec Portfolio Link</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-gofundme', this.checked)"> GoFundMe Mission</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-whitepaper', this.checked)"> Whitepaper Link</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-vcard', this.checked)"> Save Contact Badge</label>
      <label><input type="checkbox" checked onchange="toggleElement('sig-disclaimer', this.checked)"> Disclaimer Footer</label>
    </div>
  </div>
`;

content = content.replace('<div class="actions">', uiPanel + '\n  <div class="actions">');

// Add CSS for the panel
const css = `
    .customization-panel {
      background: #1e293b;
      border-radius: 8px;
      padding: 15px 20px;
      margin-bottom: 20px;
      color: #f8fafc;
    }
    .customization-panel h3 {
      margin-top: 0;
      margin-bottom: 12px;
      font-size: 15px;
      color: #38bdf8;
    }
    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
    }
    .checkbox-grid label {
      font-size: 13px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .checkbox-grid input {
      accent-color: #38bdf8;
    }
    .is-hidden {
      display: none !important;
    }
`;
content = content.replace('</style>', css + '\n  </style>');

// 2. Add Classes to Elements
// Phone: <strong style="color: #0f172a;">M:</strong> <a href="tel:3856303100"...>...</a> &nbsp;&nbsp;|&nbsp;&nbsp;
content = content.replace(/(<strong[^>]*>M:<\/strong>.*?&nbsp;&nbsp;\|&nbsp;&nbsp;)/g, '<span class="sig-phone">$1</span>');

// Email: <strong style="color: #0f172a;">E:</strong> <a href="mailto:...</a>
content = content.replace(/(<strong[^>]*>E:<\/strong>.*?<\/a>)/g, '<span class="sig-email">$1</span>');

// Web: <p style="margin: 0 0 12px 0; font-size: 12px; color: #334155;">\s*<strong style="color: #0f172a;">W:</strong>...<\/p>
content = content.replace(/(<p[^>]*>\s*<strong[^>]*>W:<\/strong>[\s\S]*?<\/p>)/g, '<div class="sig-web">$1</div>');

// Socials: <div style="margin-bottom: 12px;">\s*<a href="https:\/\/www\.linkedin\.com[\s\S]*?<\/div>
// But wait, my regex earlier matched the whole div up to the closing </div>, which includes the vcard!
// Actually, it's safer to just wrap the individual badges.
content = content.replace(/(<a href="https:\/\/www\.linkedin\.com[\s\S]*?<\/a>)/g, '<span class="sig-socials" style="display:inline-block;">$1</span>');
content = content.replace(/(<a href="https:\/\/github\.com[^>]*>\s*<img[^>]*>[\s\S]*?<\/a>)/g, '<span class="sig-socials" style="display:inline-block;">$1</span>');
content = content.replace(/(<a href="https:\/\/www\.youtube\.com[\s\S]*?<\/a>)/g, '<span class="sig-socials" style="display:inline-block;">$1</span>');
content = content.replace(/(<a href="https:\/\/www\.facebook\.com[\s\S]*?<\/a>)/g, '<span class="sig-socials" style="display:inline-block;">$1</span>');

// The Portfolio link
content = content.replace(/(<a href="https:\/\/RamonRios\.NET"[^>]*>🚀 View Executive Architecture Portfolio &rarr;<\/a><br>)/g, '<span class="sig-portfolio" style="display:inline-block;">$1</span>');

// The GoFundMe link
content = content.replace(/(<a href="https:\/\/www\.gofundme\.com[^>]*>💖 Support our Mission on GoFundMe &rarr;<\/a>)/g, '<span class="sig-gofundme" style="display:inline-block;">$1</span>');

// Whitepaper link
content = content.replace(/(<a href="https:\/\/humanos\.foundation\/whitepaper"[^>]*>📄 Read the Zero-Knowledge Whitepaper &rarr;<\/a><br>)/g, '<span class="sig-whitepaper" style="display:inline-block;">$1</span>');

// The Save Contact link
content = content.replace(/(<a href="https:\/\/raw\.githubusercontent\.com\/RamonRiosJr\/aura-hos-logo\/main\/signatures\/assets\/RamonRios\.vcf"[^>]*>[\s\S]*?<\/a>)/g, '<span class="sig-vcard" style="display:inline-block;">$1</span>');

// The Disclaimer
content = content.replace(/(<p[^>]*>\s*<strong[^>]*>CONFIDENTIALITY NOTICE:[\s\S]*?<\/p>)/g, '<div class="sig-disclaimer">$1</div>');

// 3. Inject JS
const js = `
  function toggleElement(className, isVisible) {
    const elements = document.querySelectorAll('#' + currentSig + ' .' + className);
    elements.forEach(el => {
      if (isVisible) {
        el.classList.remove('is-hidden');
      } else {
        el.classList.add('is-hidden');
      }
    });
    // Also update other tabs so they stay in sync when switching
    const allElements = document.querySelectorAll('.' + className);
    allElements.forEach(el => {
      if (isVisible) {
        el.classList.remove('is-hidden');
      } else {
        el.classList.add('is-hidden');
      }
    });
  }

  function getCleanHTML(el) {
    const clone = el.cloneNode(true);
    const hiddenElements = clone.querySelectorAll('.is-hidden');
    hiddenElements.forEach(node => node.remove());
    return clone.innerHTML.trim();
  }
`;

content = content.replace('function copyHtmlCode() {', js + '\n\n  function copyHtmlCode() {');
content = content.replace('const htmlCode = el.innerHTML.trim();', 'const htmlCode = getCleanHTML(el);');
content = content.replace('const htmlCode = el.innerHTML.trim();', 'const htmlCode = getCleanHTML(el);'); // for downloadHtmlFile

// One tricky bug: Replace only the EXACT innerHTML line in downloadHtmlFile as well.
// Wait, string.replace replaces only the FIRST occurrence.
// So doing it twice replaces it in both functions.

fs.writeFileSync('signature.html', content, 'utf8');
console.log('Script completed.');
