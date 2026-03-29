import fs from 'fs';

const svg = fs.readFileSync('src/assets/aura.svg', 'utf8');

const svgMatch = svg.match(/<svg([^>]+)>([\s\S]*?)<\/svg>/);
if (!svgMatch) throw new Error("No SVG found");

let inner = svgMatch[2];
inner = inner.replace(/xmlns:xlink/g, 'xmlnsXlink')
             .replace(/clip-path/g, 'clipPath')
             .replace(/fill-opacity/g, 'fillOpacity')
             .replace(/fill-rule/g, 'fillRule')
             .replace(/clip-rule/g, 'clipRule');

// Extract defs
const defsMatch = inner.match(/<defs>[\s\S]*?<\/defs>/);
const defs = defsMatch ? defsMatch[0] : '';

// Remove defs from inner to process the rest
let contentWithoutDefs = inner.replace(/<defs>[\s\S]*?<\/defs>/, '');

const paths = contentWithoutDefs.match(/<path[^>]+>|<g[^>]*>[\s\S]*?<\/g>/g);

let newInner = defs + '\n';
let i = 0;

// FEATURE 1: Boot-Up Sequence (Circuit Drawing)
// We add a class to the first 37 base paths so they can animate in
while (i < 37 && i < paths.length) {
  let p = paths[i];
  p = p.replace('<path ', '<path className="base-path" ');
  newInner += p + '\n';
  i++;
}

let starCount = 0;
while (i < paths.length) {
  const rand = Math.random();
  let className = 'star';
  
  if (rand < 0.30) {
    const types = ['shooting-star-1', 'shooting-star-2', 'shooting-star-3', 'shooting-star-4'];
    className = types[Math.floor(Math.random() * types.length)];
  } else if (rand < 0.45) {
    className = 'network-pulse';
  } else if (rand < 0.55) {
    className = 'data-link';
  }

  const delay = (Math.random() * 12).toFixed(2);
  
  let duration;
  if (className.startsWith('shooting-star')) {
    duration = (1.5 + Math.random() * 2.5).toFixed(2);
  } else if (className === 'network-pulse') {
    duration = (2 + Math.random() * 3).toFixed(2);
  } else if (className === 'data-link') {
    duration = (0.5 + Math.random() * 1.5).toFixed(2);
  } else {
    duration = (2 + Math.random() * 4).toFixed(2);
  }

  // FEATURE 4: Interactive Mouse Repulsion
  // Wrap each node in an interactive-node group
  newInner += `<g className="interactive-node" style={{ transition: 'transform 0.15s ease-out' }}>\n`;

  if (i + 3 < paths.length && 
      paths[i].includes('fillOpacity="0.2"') &&
      paths[i+1].includes('fillOpacity="0.4"') &&
      paths[i+2].includes('fillOpacity="0.6"') &&
      paths[i+3].includes('fill="#ffffff"')) {
      
      newInner += `<g className="${className}" style={{ animationDelay: '${delay}s', animationDuration: '${duration}s', transformOrigin: 'center', transformBox: 'fill-box' }}>\n`;
      newInner += paths[i] + '\n';
      newInner += paths[i+1] + '\n';
      newInner += paths[i+2] + '\n';
      newInner += paths[i+3] + '\n';
      newInner += `</g>\n`;
      i += 4;
      starCount++;
  } else if (paths[i].includes('fillOpacity="0.8"')) {
      let pathStr = paths[i];
      pathStr = pathStr.replace('<path ', `<path className="${className}" style={{ animationDelay: '${delay}s', animationDuration: '${duration}s', transformOrigin: 'center', transformBox: 'fill-box' }} `);
      newInner += pathStr + '\n';
      i++;
      starCount++;
  } else {
      newInner += paths[i] + '\n';
      i++;
  }
  
  newInner += `</g>\n`;
}

console.log(`Found ${starCount} stars.`);

const componentCode = `import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import './AILogo.css';

export type BotState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface AILogoProps {
  className?: string;
  botState?: BotState;
}

export function AILogo({ className = '', botState = 'idle' }: AILogoProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // FEATURE 3: Digital Glitch Transitions
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 300);
    return () => clearTimeout(timer);
  }, [botState]);

  // Create a subtle 3D tilt effect based on mouse position
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
    
    // FEATURE 4: Interactive Mouse Repulsion
    if (!svgRef.current) return;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    
    const nodes = svgRef.current.querySelectorAll('.interactive-node');
    nodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect();
      const nodeX = nodeRect.left + nodeRect.width / 2;
      const nodeY = nodeRect.top + nodeRect.height / 2;
      
      const dx = nodeX - mouseX;
      const dy = nodeY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const maxDist = 80; // Repulsion radius
      if (dist < maxDist) {
        const force = Math.pow((maxDist - dist) / maxDist, 2);
        const pushX = (dx / dist) * force * 25;
        const pushY = (dy / dist) * force * 25;
        (node as HTMLElement).style.transform = \`translate(\${pushX}px, \${pushY}px)\`;
      } else {
        (node as HTMLElement).style.transform = 'translate(0px, 0px)';
      }
    });
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    
    if (!svgRef.current) return;
    const nodes = svgRef.current.querySelectorAll('.interactive-node');
    nodes.forEach((node) => {
      (node as HTMLElement).style.transform = 'translate(0px, 0px)';
    });
  }

  return (
    <motion.div 
      className={\`ai-logo-container relative \${className}\`}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ scale: botState === 'speaking' ? 1.05 : botState === 'listening' ? 0.95 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* FEATURE 5: Audio Waveform Rings */}
      <div className={\`waveform-container \${botState === 'speaking' ? 'state-speaking-rings' : ''}\`}>
        <div className="waveform-ring"></div>
        <div className="waveform-ring"></div>
        <div className="waveform-ring"></div>
      </div>

      <svg 
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg" 
        xmlnsXlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 375 375" 
        preserveAspectRatio="xMidYMid meet" 
        className={\`w-full h-full state-\${botState} \${isGlitching ? 'glitch-active' : ''}\`}
      >
        ${newInner}
      </svg>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/components/AILogo.tsx', componentCode);
console.log("Wrote AILogo.tsx");

const cssCode = `
.ai-logo-container {
  display: inline-block;
  transform-style: preserve-3d;
  will-change: transform;
}

/* FEATURE 1: BOOT-UP SEQUENCE */
.base-path {
  animation: boot-up-draw 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
}

@keyframes boot-up-draw {
  0% { opacity: 0; filter: brightness(3) contrast(2); transform: scale(0.9); }
  40% { opacity: 1; filter: brightness(2) contrast(1.5); transform: scale(1.02); }
  100% { opacity: 1; filter: brightness(1) contrast(1); transform: scale(1); }
}

/* FEATURE 3: GLITCH TRANSITION */
.glitch-active {
  animation: glitch-anim 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
}

@keyframes glitch-anim {
  0% { transform: translate(0) }
  20% { transform: translate(-3px, 3px); filter: drop-shadow(3px 0px 0px rgba(254, 40, 96, 0.8)) drop-shadow(-3px 0px 0px rgba(47, 192, 242, 0.8)); }
  40% { transform: translate(-3px, -3px); filter: drop-shadow(4px 0px 0px rgba(254, 40, 96, 0.8)) drop-shadow(-4px 0px 0px rgba(47, 192, 242, 0.8)); }
  60% { transform: translate(3px, 3px); filter: drop-shadow(-3px 0px 0px rgba(254, 40, 96, 0.8)) drop-shadow(3px 0px 0px rgba(47, 192, 242, 0.8)); }
  80% { transform: translate(3px, -3px); filter: drop-shadow(-4px 0px 0px rgba(254, 40, 96, 0.8)) drop-shadow(4px 0px 0px rgba(47, 192, 242, 0.8)); }
  100% { transform: translate(0) }
}

/* FEATURE 5: AUDIO WAVEFORM RINGS */
.waveform-container {
  position: absolute;
  inset: -20%;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
}

.waveform-ring {
  position: absolute;
  width: 50%;
  height: 50%;
  border-radius: 50%;
  border: 2px solid rgba(47, 192, 242, 0.5);
  opacity: 0;
}

.state-speaking-rings .waveform-ring {
  animation: ripple-ring 1.5s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
}
.state-speaking-rings .waveform-ring:nth-child(2) { animation-delay: 0.5s; }
.state-speaking-rings .waveform-ring:nth-child(3) { animation-delay: 1.0s; }

@keyframes ripple-ring {
  0% { transform: scale(0.8); opacity: 0.8; border-width: 4px; }
  100% { transform: scale(2.5); opacity: 0; border-width: 1px; }
}

/* IDLE STATE */
.state-idle {
  animation: sudden-glow 6s ease-in-out infinite;
}

/* THINKING STATE */
.state-thinking {
  animation: thinking-glow 2s ease-in-out infinite;
}
.state-thinking .star { animation-duration: 1s !important; }
.state-thinking .shooting-star-1, 
.state-thinking .shooting-star-2, 
.state-thinking .shooting-star-3, 
.state-thinking .shooting-star-4 {
  animation-duration: 0.8s !important;
  opacity: 0.8;
}
.state-thinking .network-pulse { animation-duration: 1s !important; }
.state-thinking .data-link { animation-duration: 0.2s !important; }

/* SPEAKING STATE */
.state-speaking {
  animation: speaking-glow 0.8s ease-in-out infinite alternate;
}
.state-speaking .star { animation-duration: 0.5s !important; }
.state-speaking .shooting-star-1, 
.state-speaking .shooting-star-2, 
.state-speaking .shooting-star-3, 
.state-speaking .shooting-star-4 {
  animation-duration: 0.5s !important;
}
.state-speaking .network-pulse { animation-duration: 0.5s !important; }
.state-speaking .data-link { animation-duration: 0.1s !important; }

/* FEATURE 2: LISTENING STATE (Gravity Pull) */
.state-listening {
  animation: listening-glow 3s ease-in-out infinite;
}
.state-listening .star { animation-duration: 1.5s !important; }
.state-listening .shooting-star-1 { animation-name: shoot-1-reverse; }
.state-listening .shooting-star-2 { animation-name: shoot-2-reverse; }
.state-listening .shooting-star-3 { animation-name: shoot-3-reverse; }
.state-listening .shooting-star-4 { animation-name: shoot-4-reverse; }
.state-listening .network-pulse { animation-name: network-ping-reverse; }

@keyframes listening-glow {
  0%, 100% { filter: drop-shadow(0px 0px 5px rgba(10, 69, 112, 0.5)); }
  50% { filter: drop-shadow(0px 0px 20px rgba(47, 192, 242, 0.8)); }
}

@keyframes shoot-1-reverse {
  0% { opacity: 0; transform: scale(0) translate(15px, 15px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(-15px, -15px); }
}
@keyframes shoot-2-reverse {
  0% { opacity: 0; transform: scale(0) translate(-15px, -15px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(15px, 15px); }
}
@keyframes shoot-3-reverse {
  0% { opacity: 0; transform: scale(0) translate(0px, -20px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(0px, 20px); }
}
@keyframes shoot-4-reverse {
  0% { opacity: 0; transform: scale(0) translate(20px, 0px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(-20px, 0px); }
}
@keyframes network-ping-reverse {
  0% { opacity: 0; transform: scale(2.5); }
  10% { opacity: 0.8; transform: scale(1.5); }
  30%, 100% { opacity: 0; transform: scale(1); }
}


/* GLOW ANIMATIONS */
@keyframes sudden-glow {
  0%, 40%, 60%, 100% { filter: drop-shadow(0px 0px 0px rgba(47, 192, 242, 0)); }
  50% { filter: drop-shadow(0px 0px 25px rgba(47, 192, 242, 0.6)); }
}

@keyframes thinking-glow {
  0%, 100% { filter: drop-shadow(0px 0px 10px rgba(47, 192, 242, 0.3)); }
  50% { filter: drop-shadow(0px 0px 35px rgba(10, 69, 112, 0.9)); }
}

@keyframes speaking-glow {
  0% { filter: drop-shadow(0px 0px 5px rgba(47, 192, 242, 0.4)); }
  100% { filter: drop-shadow(0px 0px 40px rgba(47, 192, 242, 1)); }
}

/* STAR ANIMATIONS */
.star {
  animation-name: twinkle;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.shooting-star-1, 
.shooting-star-2, 
.shooting-star-3, 
.shooting-star-4 {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-iteration-count: infinite;
  opacity: 0;
}

.shooting-star-1 { animation-name: shoot-1; }
.shooting-star-2 { animation-name: shoot-2; }
.shooting-star-3 { animation-name: shoot-3; }
.shooting-star-4 { animation-name: shoot-4; }

.network-pulse {
  animation-name: network-ping;
  animation-timing-function: cubic-bezier(0.1, 0.8, 0.3, 1);
  animation-iteration-count: infinite;
}

.data-link {
  animation-name: data-transfer;
  animation-timing-function: steps(2, end);
  animation-iteration-count: infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.6); }
  50% { opacity: 1; transform: scale(1.2); }
}

/* Diagonal Right-Down */
@keyframes shoot-1 {
  0% { opacity: 0; transform: scale(0) translate(-15px, -15px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(15px, 15px); }
}

/* Diagonal Left-Up */
@keyframes shoot-2 {
  0% { opacity: 0; transform: scale(0) translate(15px, 15px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(-15px, -15px); }
}

/* Vertical Up */
@keyframes shoot-3 {
  0% { opacity: 0; transform: scale(0) translate(0px, 20px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(0px, -20px); }
}

/* Horizontal Right */
@keyframes shoot-4 {
  0% { opacity: 0; transform: scale(0) translate(-20px, 0px); }
  10% { opacity: 1; transform: scale(1.5) translate(0, 0); }
  20%, 100% { opacity: 0; transform: scale(0) translate(20px, 0px); }
}

/* Sonar Ping Effect */
@keyframes network-ping {
  0% { opacity: 1; transform: scale(1); }
  30% { opacity: 0; transform: scale(2.5); }
  100% { opacity: 0; transform: scale(1); }
}

/* Rapid Data Transfer Blink */
@keyframes data-transfer {
  0%, 100% { opacity: 0.3; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(1.5); }
}
`;

fs.writeFileSync('src/components/AILogo.css', cssCode);
console.log("Wrote AILogo.css");
