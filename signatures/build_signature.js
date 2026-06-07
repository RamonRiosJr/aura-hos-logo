import fs from 'fs';
import path from 'path';

// Resolve paths
const DIR = process.cwd();
const CONFIG_PATH = path.join(DIR, 'config.json');
const TEMPLATE_PATH = path.join(DIR, 'signature.template.html');
const OUTPUT_PATH = path.join(DIR, 'signature.html');

// Read config
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// Base HTML templates for generating the UI Panel
function generateUIPanel(brands) {
  // Extract all unique action links and socials to create toggles
  // For simplicity, we create standard ones
  return `
  <div class="customization-panel" style="background: #1e293b; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; color: #f8fafc;">
    <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 15px; color: #38bdf8;">⚙️ Signature Customization</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px;">
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-phone', this.checked)" style="accent-color: #38bdf8;"> Cell Phone</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-portfolio', this.checked)" style="accent-color: #38bdf8;"> Exec Portfolio Link</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-gofundme', this.checked)" style="accent-color: #38bdf8;"> GoFundMe Mission</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-vcard', this.checked)" style="accent-color: #38bdf8;"> Save Contact Badge</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-github', this.checked)" style="accent-color: #38bdf8;"> GitHub Badge</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-youtube-humanos', this.checked)" style="accent-color: #38bdf8;"> YouTube (Humanos)</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-youtube-coqui', this.checked)" style="accent-color: #38bdf8;"> YouTube (Coqui)</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-facebook-humanos', this.checked)" style="accent-color: #38bdf8;"> Facebook (Humanos)</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-facebook-coqui', this.checked)" style="accent-color: #38bdf8;"> Facebook (Coqui)</label>
      <label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" checked onchange="toggleElement('sig-facebook-personal', this.checked)" style="accent-color: #38bdf8;"> Facebook (Personal)</label>
    </div>
    
    <div style="border-top: 1px solid #334155; padding-top: 15px;">
      <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">📦 Raw Identity Assets</h3>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <a href="https://github.com/RamonRiosJr.png" target="_blank" download="RamonRios_Profile.png" class="asset-btn">🖼️ Exec Profile Photo</a>
        <a href="https://raw.githubusercontent.com/RamonRiosJr/aura-hos-logo/main/src/assets/aura-hos.png" target="_blank" download="Aura_hOS_Logo.png" class="asset-btn">✨ Aura hOS Logo</a>
        <a href="https://raw.githubusercontent.com/RamonRiosJr/aura-hos-logo/main/signatures/assets/coqui-logo.png" target="_blank" download="Coqui_Logo.png" class="asset-btn">🐸 Coqui Cloud Logo</a>
        <a href="https://raw.githubusercontent.com/RamonRiosJr/aura-hos-logo/main/src/assets/hos-humnos-foundation.png" target="_blank" download="Humanos_Foundation_Logo.png" class="asset-btn">🏛️ Humanos Logo</a>
        <a href="https://RamonRiosJr.github.io/aura-hos-logo/signatures/assets/RamonRios.vcf" target="_blank" download="RamonRios.vcf" class="asset-btn">📇 vCard (.vcf) File</a>
      </div>
    </div>
  </div>`;
}

// Generate the HTML for a single signature brand
function generateSignatureHTML(brand, index) {
  const isActive = index === 0 ? 'active' : '';
  
  // Render Logos
  const logosHtml = brand.logos.map(logo => {
    let style = `display: block; margin: ${logo.margin || '0 auto'};`;
    if (logo.radius) style += ` border-radius: ${logo.radius};`;
    if (logo.border) style += ` border: ${logo.border};`;
    if (logo.opacity) style += ` opacity: ${logo.opacity};`;
    return `<img src="${logo.src}" width="${logo.width}" ${logo.height ? `height="${logo.height}"` : ''} style="${style}" />`;
  }).join('\n            ');

  // Render Websites
  const websitesHtml = brand.websites.map(site => 
    `<strong style="color: #0f172a;">${site.label}</strong> <a href="${site.url}" style="color: #3b82f6; text-decoration: none;">${site.text}</a>`
  ).join(' &nbsp;&nbsp;|&nbsp;&nbsp;\n              ');

  // Render Social Badges
  const badgesMap = {
    linkedin: { color: '0A66C2', logo: 'linkedin', text: 'LinkedIn' },
    github: { color: '181717', logo: 'github', text: 'GitHub' },
    youtube: { color: 'FF0000', logo: 'youtube', text: 'YouTube' },
    facebook: { color: '1877F2', logo: 'facebook', text: 'Facebook' },
    vcard: { color: '6366f1', logo: 'minutemailer', text: 'Save Contact' }
  };

  const socialsHtml = brand.socials.map(social => {
    const badge = badgesMap[social.type];
    const badgeUrl = `https://img.shields.io/badge/-${badge.text.replace(' ', '_')}-${badge.color}?style=flat&logo=${badge.logo}&logoColor=white`;
    let html = `<a href="${social.url}" style="display: inline-block; margin-right: 8px; text-decoration: none;">
                <img src="${badgeUrl}" alt="${badge.text}" height="22" style="border-radius: 12px;">
              </a>`;
    if (social.badge) {
      html = `<span class="${social.badge}" style="display:inline-block;">${html}</span>`;
    } else if (social.type === 'vcard') {
      html = `<span class="sig-vcard" style="display:inline-block;">${html}</span>`;
    }
    return html;
  }).join('\n              ');

  // Render Action Links
  const linksHtml = brand.actionLinks.map(link => {
    let html = `<a href="${link.url}" style="font-size: ${link.class === 'sig-portfolio' ? '13px' : '12px'}; font-weight: bold; color: ${link.color}; text-decoration: none; display: inline-block; margin-bottom: 4px;">${link.text}</a><br>`;
    if (link.class) {
      html = `<span class="${link.class}" style="display:inline-block;">${html}</span>`;
    }
    return html;
  }).join('\n              ');

  return `
    <!-- ${brand.tabLabel.toUpperCase()} SIGNATURE -->
    <div id="sig-${brand.id}" class="signature-wrapper ${isActive}">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; line-height: 1.4; font-size: 13px; background-color: #ffffff; color: #1e293b;">
        <tr>
          <!-- Logo Cell -->
          <td valign="top" align="center" width="110" style="width: 110px; min-width: 110px; padding-right: 20px; border-right: 2px solid #3b82f6;">
            ${logosHtml}
          </td>
          
          <!-- Content Cell -->
          <td valign="top" style="padding-left: 20px; color: #1e293b;">
            <h3 style="margin: 0 0 2px 0; font-size: 18px; font-weight: 700; color: #0f172a;">${brand.name}</h3>
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #3b82f6;">${brand.title}${brand.subtitle ? `<br>${brand.subtitle}` : ''}</p>
            
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #334155;">
              <span class="sig-phone"><strong style="color: #0f172a;">M:</strong> <a href="tel:${brand.phone.replace(/-/g, '')}" style="color: inherit; text-decoration: none;">${brand.phone}</a> &nbsp;&nbsp;|&nbsp;&nbsp;</span>
              <strong style="color: #0f172a;">E:</strong> <a href="mailto:${brand.email}" style="color: #3b82f6; text-decoration: none;">${brand.email}</a>
            </p>
            <p style="margin: 0 0 12px 0; font-size: 12px; color: #334155;">
              ${websitesHtml}
            </p>

            <div style="margin-bottom: 12px;">
              ${socialsHtml}
            </div>

            <div style="margin-bottom: 12px;">
              ${linksHtml}
            </div>

            <div style="border-top: 1px solid #cbd5e1; padding-top: 10px; max-width: 100%;">
              <p style="margin: 0 0 4px 0; font-size: 11px; line-height: 1.4; color: #475569;">
                <strong style="color: #3b82f6;">${brand.visionLabel || 'Vision:'}</strong> ${brand.vision}
              </p>
              <p style="margin: 0; font-size: 10px; color: #64748b; text-align: justify; line-height: 1.3;">
                <strong style="color: #475569;">CONFIDENTIALITY NOTICE:</strong> This communication, along with any attachments, is covered by federal and state law governing electronic communications and may contain confidential and legally privileged information. If the reader of this message is not the intended recipient, you are hereby notified that any dissemination, distribution, use or copying of this message is strictly prohibited. If you have received this in error, please reply immediately to the sender and delete this message.
              </p>
            </div>
          </td>
        </tr>
      </table>
    </div>`;
}

// Read the template
let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Generate the injected content
const uiPanelHtml = generateUIPanel(config.brands);
const signaturesHtml = config.brands.map((brand, index) => generateSignatureHTML(brand, index)).join('\n');

// Perform the injection
template = template.replace('<!-- INJECT:UI_PANEL -->', uiPanelHtml);
template = template.replace('<!-- INJECT:SIGNATURES -->', signaturesHtml);

// Save to dist file
fs.writeFileSync(OUTPUT_PATH, template);
console.log('Successfully compiled signature.html!');
