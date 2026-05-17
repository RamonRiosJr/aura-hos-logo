# Executive Identity & UI Assets

An enterprise-grade utility package containing scalable brand assets and automated communication infrastructure for the **Humanos Foundation**, **Aura hOS**, and **Coqui Cloud** ecosystems.

## 🏗️ Architecture Overview

This module is split into two distinct toolsets, demonstrating a commitment to zero-dependency architecture, automated workflows, and highly resilient infrastructure.

### 1. The Dynamic Signature Generator (`/signatures`)
A client-side, zero-dependency dashboard for deploying highly customized executive email signatures.

*   **Offline-First & Zero-Trust:** Operates entirely within the browser (`signature.html`) with zero backend dependencies, build steps, or vulnerable `npm` packages.
*   **Infrastructure Hardening:** Employs globally distributed CDNs for image delivery, eliminating link rot and preventing external server single-points-of-failure.
*   **Dynamic Customization Engine:** Features a JavaScript-powered toggle panel to dynamically inject or strip contact modules (Phone, GoFundMe, Executive Portfolio, vCard) before export.
*   **Clean HTML Export:** Built-in DOM cloning guarantees that disabled/hidden elements are completely erased from the exported HTML payload, bypassing aggressive email client filtering.

### 2. Neural Core React Component (`/src`)
A scalable, state-driven animated SVG representation of the Aura hOS AI neural network.

*   **State-Driven Animations:** Integrates seamlessly with React state architecture to visualize complex AI operations (`idle`, `listening`, `thinking`, `speaking`).
*   **Responsive & Themeable:** Fully compatible with TailwindCSS dark/light modes and fluid responsive containers.
*   **Performance Optimized:** Relies entirely on native SVG CSS keyframe animations rather than heavy external libraries, ensuring maximum frame rates and minimal bundle size.

## 🚀 Quick Start

### Email Signature Generator
Simply navigate to the `/signatures/` directory and open `signature.html` in any web browser. Use the customization panel to tailor the payload, and click **Copy HTML Code** to deploy directly into your email client.

### Neural Core Logo
```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

## 🔒 Security & Compliance
This repository has been strictly audited. It contains zero hardcoded API keys, environment secrets, or proprietary backend architecture. All exposed contact artifacts (vCard, email, phone) are explicitly authorized for public executive networking.
