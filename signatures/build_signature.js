import fs from 'fs';
import path from 'path';

// Resolve paths
const DIR = process.cwd();
const CONFIG_PATH = path.join(DIR, 'config.json');
const TEMPLATE_PATH = path.join(DIR, 'signature.template.html');
const OUTPUT_PATH = path.join(DIR, 'signature.html');

// Read config
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// Master UI definition
const UI_TOGGLES = [
  { id: 'sig-phone', label: 'Cell Phone' },
  { id: 'sig-portfolio', label: 'Exec Portfolio Link' },
  { id: 'sig-gofundme', label: 'GoFundMe Mission' },
  { id: 'sig-vcard', label: 'Save Contact Badge' },
  { id: 'sig-github', label: 'GitHub Badge' },
  { id: 'sig-youtube-humanos', label: 'YouTube (Humanos)' },
  { id: 'sig-youtube-coqui', label: 'YouTube (Coqui)' },
  { id: 'sig-facebook-humanos', label: 'Facebook (Humanos)' },
  { id: 'sig-facebook-coqui', label: 'Facebook (Coqui)' },
  { id: 'sig-facebook-personal', label: 'Facebook (Personal)' }
];

const MASTER_SOCIALS = [
  { type: 'linkedin', badge: '', url: 'https://www.linkedin.com/in/ramon-rios-a8ba3035/' },
  { type: 'github', badge: 'sig-github', url: 'https://github.com/RamonRiosJr' },
  { type: 'youtube', badge: 'sig-youtube-humanos', url: 'https://www.youtube.com/@humanosfoundation' },
  { type: 'youtube', badge: 'sig-youtube-coqui', url: 'https://www.youtube.com/@coquicloud' },
  { type: 'facebook', badge: 'sig-facebook-humanos', url: 'https://www.facebook.com/HumanosFoundation' },
  { type: 'facebook', badge: 'sig-facebook-coqui', url: 'https://www.facebook.com/coquicloud' },
  { type: 'facebook', badge: 'sig-facebook-personal', url: 'https://www.facebook.com/ingrios' },
  { type: 'vcard', badge: 'sig-vcard', url: 'https://RamonRiosJr.github.io/aura-hos-logo/signatures/assets/RamonRios.vcf' }
];

const MASTER_LINKS = [
  { class: 'sig-portfolio', color: '#10b981', url: 'https://RamonRios.NET', text: '🚀 View Executive Architecture Portfolio &rarr;' },
  { class: 'sig-gofundme', color: '#f59e0b', url: 'https://www.gofundme.com/f/help-build-aura-hos-bridge-to-health-data-freedom', text: '💖 Support our Mission on GoFundMe &rarr;' }
];

// UTM Append Helper
function appendUTM(url, brandId) {
  if (url.startsWith('mailto:') || url.startsWith('tel:')) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has('utm_source')) {
      u.searchParams.set('utm_source', 'email_signature');
      u.searchParams.set('utm_medium', 'email');
      u.searchParams.set('utm_campaign', brandId);
    }
    return u.toString();
  } catch (e) {
    return url;
  }
}

// Base HTML templates for generating the UI Panel
function generateUIPanel(brands) {
  return `
  <div class="customization-panel" style="background: #1e293b; border-radius: 8px; padding: 15px 20px; margin-bottom: 20px; color: #f8fafc;">
    <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 15px; color: #38bdf8;">⚙️ Signature Customization</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 10px; margin-bottom: 20px;">
      ${UI_TOGGLES.map(t => `<label style="font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;"><input type="checkbox" data-target="${t.id}" onchange="toggleElement('${t.id}', this.checked)" style="accent-color: #38bdf8;"> ${t.label}</label>`).join('\n      ')}
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
  
  // Calculate preset classes for this brand
  const presetClasses = ['sig-phone']; // Phone is always default
  brand.socials.forEach(s => {
    if (s.badge) presetClasses.push(s.badge);
    if (s.type === 'vcard') presetClasses.push('sig-vcard');
  });
  brand.actionLinks.forEach(l => {
    if (l.class) presetClasses.push(l.class);
  });

  // Render Logos with Alt tags
  const logosHtml = brand.logos.map(logo => {
    let style = `display: block; margin: ${logo.margin || '0 auto'};`;
    if (logo.radius) style += ` border-radius: ${logo.radius};`;
    if (logo.border) style += ` border: ${logo.border};`;
    if (logo.opacity) style += ` opacity: ${logo.opacity};`;
    return `<img src="${logo.src}" alt="${brand.name} Logo" width="${logo.width}" ${logo.height ? `height="${logo.height}"` : ''} style="${style}" />`;
  }).join('\n            ');

  // Render Websites with UTM tracking
  const websitesHtml = brand.websites.map(site => 
    `<strong style="color: #0f172a;">${site.label}</strong> <a href="${appendUTM(site.url, brand.id)}" style="color: #3b82f6; text-decoration: none;">${site.text}</a>`
  ).join(' &nbsp;&nbsp;|&nbsp;&nbsp;\n              ');

  // Render Social Badges
  const badgesMap = {
    linkedin: { color: '0A66C2', logo: 'linkedin', text: 'LinkedIn' },
    github: { color: '181717', logo: 'github', text: 'GitHub' },
    youtube: { color: 'FF0000', logo: 'youtube', text: 'YouTube' },
    facebook: { color: '1877F2', logo: 'facebook', text: 'Facebook' },
    vcard: { color: '6366f1', logo: 'minutemailer', text: 'Save Contact' }
  };

  const socialsHtml = MASTER_SOCIALS.map(ms => {
    // Check if brand overrides this URL
    const brandOverride = brand.socials.find(s => s.badge === ms.badge && s.type === ms.type);
    const rawUrl = brandOverride ? brandOverride.url : ms.url;
    // Apply UTM tracking to social link
    const url = appendUTM(rawUrl, brand.id);
    
    // Check if it's in the preset, otherwise start hidden
    const isHidden = (ms.badge && !presetClasses.includes(ms.badge)) ? 'is-hidden' : '';

    const badge = badgesMap[ms.type];
    const badgeUrl = `https://img.shields.io/badge/-${badge.text.replace(' ', '_')}-${badge.color}?style=flat&logo=${badge.logo}&logoColor=white`;
    let html = `<a href="${url}" style="display: inline-block; margin-right: 8px; text-decoration: none;">
                <img src="${badgeUrl}" alt="${badge.text}" height="22" style="border-radius: 12px;">
              </a>`;
    if (ms.badge) {
      html = `<span class="${ms.badge} ${isHidden}" style="display:inline-block;">${html}</span>`;
    } else if (ms.type === 'vcard') {
      html = `<span class="sig-vcard ${isHidden}" style="display:inline-block;">${html}</span>`;
    }
    return html;
  }).join('\n              ');

  // Render Action Links with UTM tracking
  const allLinks = [];
  // Add brand-specific links that have no class (like Tech Demo)
  brand.actionLinks.filter(l => !l.class).forEach(l => allLinks.push(l));
  // Add Master links
  MASTER_LINKS.forEach(ml => {
    const isHidden = !presetClasses.includes(ml.class);
    allLinks.push({ ...ml, isHidden });
  });

  const linksHtml = allLinks.map(link => {
    const url = appendUTM(link.url, brand.id);
    let html = `<a href="${url}" style="font-size: ${link.class === 'sig-portfolio' ? '13px' : '12px'}; font-weight: bold; color: ${link.color}; text-decoration: none; display: inline-block; margin-bottom: 4px;">${link.text}</a><br>`;
    if (link.class) {
      html = `<span class="${link.class} ${link.isHidden ? 'is-hidden' : ''}" style="display:inline-block;">${html}</span>`;
    }
    return html;
  }).join('\n              ');

  // Stringify the presets so JS can read it later
  const presetJson = JSON.stringify(presetClasses);

  return `
    <!-- ${brand.tabLabel.toUpperCase()} SIGNATURE -->
    <div id="sig-${brand.id}" class="signature-wrapper ${isActive}" data-preset='${presetJson}'>
      <!--[if mso]>
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="width: 600px;"><tr><td>
      <![endif]-->
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; max-width: 600px; line-height: 1.4; font-size: 13px; color: #1e293b; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
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
              <span class="sig-phone ${!presetClasses.includes('sig-phone') ? 'is-hidden' : ''}"><strong style="color: #0f172a;">M:</strong> <a href="tel:${brand.phone.replace(/-/g, '')}" style="color: inherit; text-decoration: none;">${brand.phone}</a> &nbsp;&nbsp;|&nbsp;&nbsp;</span>
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
      <!--[if mso]>
      </td></tr></table>
      <![endif]-->
    </div>`;
}

// Read the template
let template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

// Generate the injected content
const uiPanelHtml = generateUIPanel(config.brands);
let signaturesHtml = config.brands.map((brand, index) => generateSignatureHTML(brand, index)).join('\n');

// HTML Minification (Optional aggressive minification logic)
// To prevent Outlook rendering bugs, we strip excess whitespace between tags inside the signatures 
signaturesHtml = signaturesHtml.replace(/>\s+</g, '><');

// Perform the injection
template = template.replace('<!-- INJECT:UI_PANEL -->', uiPanelHtml);
template = template.replace('<!-- INJECT:SIGNATURES -->', signaturesHtml);

// Save to dist file
fs.writeFileSync(OUTPUT_PATH, template);
console.log('Successfully compiled signature.html!');
