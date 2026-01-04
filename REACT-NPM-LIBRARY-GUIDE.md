# The Definitive Guide to Building Production-Ready React NPM Libraries

**A practical guide based on real-world experience fixing broken packages and studying popular libraries.**

> **Author's Note:** This guide was created after completely refactoring a broken React component library. Every recommendation here comes from actual problems we encountered and solved. If you're building a React NPM package, this guide will save you weeks of debugging.

---

## Table of Contents

1. [Introduction: Why Most React Libraries Break](#introduction)
2. [The Fundamental Problem: Application Code vs Library Code](#the-fundamental-problem)
3. [Project Setup & Structure](#project-setup--structure)
4. [The CSS Problem & Solutions](#the-css-problem--solutions)
5. [Build Configuration](#build-configuration)
6. [Package.json Configuration](#packagejson-configuration)
7. [TypeScript Configuration](#typescript-configuration)
8. [Testing Before Publishing](#testing-before-publishing)
9. [Common Pitfalls & Solutions](#common-pitfalls--solutions)
10. [Real-World Examples](#real-world-examples)
11. [Publishing Checklist](#publishing-checklist)

---

## Introduction

### What We Fixed (Real Story)

Our package was completely broken:
- ❌ Couldn't be imported by users
- ❌ CSS imports failed
- ❌ Only CommonJS output (no ESM)
- ❌ React 18/19 incompatibility
- ❌ TypeScript errors
- ❌ Missing "use client" directive
- ❌ Wrong module exports

**After fixes:**
- ✅ Works in Next.js, Vite, Webpack, all bundlers
- ✅ Supports React 18 & 19
- ✅ Dual ESM/CJS output
- ✅ CSS via variables (customizable with className!)
- ✅ TypeScript support
- ✅ RSC compatible

### Who This Guide Is For

- Building your first React NPM package
- Your package works locally but fails when installed
- Users report "Module not found" or CSS errors
- Migrating from Create React App to a library
- Want to build like the pros (React, Material-UI, Radix UI)

---

## The Fundamental Problem

### Application Code vs Library Code

This is the **#1 reason** React libraries break:

```jsx
// ✅ THIS WORKS IN APPLICATIONS (Next.js, CRA, Vite)
import "./styles.css";  // Bundler processes this
import logo from "./logo.png";  // Bundler handles this

// ❌ THIS BREAKS IN LIBRARIES
// Why? After TypeScript compilation:
require("./styles.css");  // JavaScript can't require CSS!
```

**The Core Difference:**

| Aspect | Application | Library |
|--------|-------------|---------|
| **Processed by** | Your bundler | User's bundler |
| **Build output** | HTML + JS bundle | Compiled JS modules |
| **CSS imports** | Work (bundler magic) | Break (no bundler yet) |
| **File imports** | Work (bundler handles) | Break (paths invalid) |
| **React** | You provide | User provides (peer dep) |

**Key Insight:** Your library ships **pre-compiled JavaScript**. Users' bundlers only see the compiled output, not your source code.

---

## Project Setup & Structure

### Recommended Structure

```
my-react-library/
├── src/
│   ├── index.ts                    # Main entry (exports everything)
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx          # Component
│   │   │   ├── Button.types.ts     # Types
│   │   │   └── index.ts            # Barrel export
│   │   └── Card/
│   │       ├── Card.tsx
│   │       ├── Card.types.ts
│   │       └── index.ts
│   └── hooks/
│       ├── useCustomHook.ts
│       └── index.ts
├── dist/                           # Build output (gitignored)
│   ├── index.js                    # CJS bundle
│   ├── index.mjs                   # ESM bundle
│   ├── index.d.ts                  # CJS types
│   └── index.d.mts                 # ESM types
├── package.json
├── tsconfig.json
├── tsup.config.ts                  # Build config
├── .gitignore
├── .npmignore
├── README.md
└── LICENSE
```

### Initial Setup

```bash
mkdir my-react-library
cd my-react-library
npm init -y
git init
```

---

## The CSS Problem & Solutions

### ❌ What Doesn't Work (And Why)

#### CSS Modules (BREAKS!)

```tsx
// ❌ DON'T DO THIS IN LIBRARIES
import styles from "./Button.module.css";

export const Button = () => <button className={styles.button}>Click</button>;
```

**Why it breaks:**
1. TypeScript compiles to: `var styles = require("./Button.module.css");`
2. User's bundler tries to process CSS from `node_modules`
3. CSS Modules need build-time processing
4. Error: "Module not found" or "Cannot require CSS"

#### Direct CSS Import (BREAKS!)

```tsx
// ❌ DON'T DO THIS IN LIBRARIES
import "./Button.css";

export const Button = () => <button className="button">Click</button>;
```

**Why it breaks:**
1. Compiles to: `require("./Button.css");`
2. JavaScript can't require CSS files
3. Only works when a bundler processes it

### ✅ Solutions That Actually Work

We tried three approaches in our real project. Here's what worked:

#### **Option 1: Inline Styles with CSS Variables (BEST - What We Use)**

```tsx
// Component file
const defaultStyles: React.CSSProperties = {
  height: "var(--my-component-height, 500px)",
  width: "var(--my-component-width, 100vw)",
  padding: "var(--my-component-padding, 16px)",
  backgroundColor: "var(--my-component-bg, #fff)",
};

export const MyComponent = ({ style, className }) => {
  return (
    <div
      className={className}
      style={{ ...defaultStyles, ...style }}
    >
      Content
    </div>
  );
};
```

**User customization via className (works!):**

```css
/* User's CSS file */
.custom {
  --my-component-height: 800px;
  --my-component-width: 50vw;
  --my-component-bg: #000;
}
```

```jsx
// User's code
<MyComponent className="custom" />  // Variables override defaults!
```

**Why this is best:**
- ✅ Works immediately (no CSS import)
- ✅ Customizable via className (CSS variables)
- ✅ Customizable via style prop
- ✅ No build complexity
- ✅ No external files needed
- ✅ Used by: Headless UI, Radix UI

**When to use:** Components with simple, structural styles

#### **Option 2: CSS-in-JS (Styled Components, Emotion)**

```tsx
import styled from '@emotion/styled';

const StyledButton = styled.button`
  padding: 12px 24px;
  background: blue;
  color: white;
  &:hover {
    background: darkblue;
  }
`;

export const Button = () => <StyledButton>Click</StyledButton>;
```

**Why this works:**
- ✅ Styles bundled with JS
- ✅ No CSS files to import
- ✅ Dynamic styling
- ✅ SSR support

**Drawbacks:**
- ❌ Adds runtime dependency
- ❌ Larger bundle size
- ❌ Runtime performance cost
- ❌ Used by: Material-UI, Chakra UI

**When to use:** Complex components with dynamic styles, theming

#### **Option 3: Separate CSS Export (Traditional)**

```tsx
// Component (no CSS import!)
export const Button = ({ className }) => (
  <button className={`my-button ${className}`}>Click</button>
);
```

```json
// package.json
{
  "exports": {
    ".": "./dist/index.js",
    "./styles.css": "./dist/styles.css"
  }
}
```

**User must import CSS:**

```jsx
import { Button } from "my-library";
import "my-library/styles.css";  // Required!
```

**Why this works:**
- ✅ User's bundler processes the CSS
- ✅ Small JS bundle
- ✅ Static CSS (best performance)

**Drawbacks:**
- ❌ Users must remember to import CSS
- ❌ Extra step
- ❌ Used by: React Toastify, React Datepicker

**When to use:** Large style libraries, theming systems

### Our Recommendation: Start with Option 1

**CSS Variables + Inline Styles** give you:
- Zero setup for users
- Full customization power
- No build complexity
- Works everywhere

You can always add Option 3 later for advanced users.

---

## Build Configuration

### Use tsup (Not plain tsc!)

**Why tsup?**
- ✅ Outputs both ESM and CJS
- ✅ Handles "use client" directive
- ✅ Bundles dependencies
- ✅ Generates type declarations
- ✅ Zero config

**Install:**

```bash
npm install -D tsup typescript
```

### tsup.config.ts

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  // Entry point
  entry: ["src/index.ts"],

  // Output both ESM and CommonJS
  format: ["esm", "cjs"],

  // Generate TypeScript declarations
  dts: {
    resolve: true,
  },

  // Source maps for debugging
  sourcemap: true,

  // Clean dist before build
  clean: true,

  // Don't bundle peer dependencies
  external: ["react", "react-dom"],

  // Enable tree shaking
  treeshake: true,

  // Target modern browsers
  target: "es2020",

  // Don't minify (users can do this)
  minify: false,

  // No code splitting for libraries
  splitting: false,

  // For Next.js App Router compatibility
  banner: {
    js: '"use client";',  // If your components use hooks
  },
});
```

**Alternative: If you need more control, use Rollup**

```bash
npm install -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve
```

But tsup is simpler and works for 95% of cases.

---

## Package.json Configuration

### The Complete package.json

```json
{
  "name": "@yourscope/package-name",
  "version": "1.0.0",
  "description": "Your package description",
  "author": "Your Name <email@example.com>",
  "license": "MIT",

  // 🔴 CRITICAL: Entry points for different module systems
  "main": "./dist/index.js",        // CommonJS (Node.js, Webpack 4)
  "module": "./dist/index.mjs",     // ESM (Vite, modern bundlers)
  "types": "./dist/index.d.ts",     // TypeScript types

  // 🔴 CRITICAL: Modern exports (Node 12.7+, all modern tools)
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },

  // 🔴 CRITICAL: Enable tree-shaking
  "sideEffects": false,

  // Files to include in published package
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],

  // Scripts
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  },

  // 🔴 CRITICAL: Peer dependencies (user provides these)
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },

  // Dev dependencies (not published)
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },

  // Runtime dependencies (bundled with package)
  "dependencies": {
    // Only add if you import them in your code
    // Example: "clsx": "^2.0.0"
  },

  // Metadata
  "repository": {
    "type": "git",
    "url": "git+https://github.com/username/repo.git"
  },
  "keywords": ["react", "component", "ui"],
  "bugs": {
    "url": "https://github.com/username/repo/issues"
  },
  "homepage": "https://github.com/username/repo#readme"
}
```

### Critical Fields Explained

#### `main`, `module`, `types`

```json
{
  "main": "./dist/index.js",      // 🔴 MUST be CommonJS
  "module": "./dist/index.mjs",   // 🔴 MUST be ESM
  "types": "./dist/index.d.ts"    // 🔴 MUST point to types
}
```

**What uses what:**
- Node.js, Webpack 4, Jest: `main`
- Vite, Rollup, modern bundlers: `module`
- TypeScript, IDEs: `types`

#### `exports` (Modern Way)

```json
{
  "exports": {
    ".": {
      "import": "./dist/index.mjs",   // ESM import
      "require": "./dist/index.js",   // CJS require
      "types": "./dist/index.d.ts"    // Types for both
    }
  }
}
```

**Supports conditional exports:**

```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./button": "./dist/components/button.mjs",
    "./styles": "./dist/styles.css"
  }
}
```

Users can then:

```js
import { Component } from "my-lib";           // Main export
import { Button } from "my-lib/button";       // Sub-export
import "my-lib/styles";                       // CSS
```

#### `sideEffects`

```json
{
  "sideEffects": false
}
```

**What this means:**
- "My code is pure, no side effects"
- Bundlers can tree-shake unused exports
- Results in smaller user bundles

**If you have side effects:**

```json
{
  "sideEffects": ["./dist/polyfills.js", "**/*.css"]
}
```

#### `peerDependencies` vs `dependencies`

**Use `peerDependencies` for:**
- React, React DOM
- Major frameworks (Next.js, etc.)
- Anything the user likely already has

**Why:** Prevents duplicate versions, version conflicts

```json
{
  "peerDependencies": {
    "react": ">=18.0.0"  // User must provide React 18+
  }
}
```

**Use `dependencies` for:**
- Utilities you import (clsx, date-fns, etc.)
- Libraries user doesn't need directly

```json
{
  "dependencies": {
    "clsx": "^2.0.0"  // Bundled with your package
  }
}
```

**Use `devDependencies` for:**
- Build tools (tsup, typescript)
- Testing libraries
- Types
- **React** (for development only!)

```json
{
  "devDependencies": {
    "react": "^19.0.0",      // For local dev
    "tsup": "^8.0.0",        // Build tool
    "@types/react": "^19.0.0" // Types
  }
}
```

---

## TypeScript Configuration

### tsconfig.json for Libraries

```json
{
  "compilerOptions": {
    // Output settings
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],

    // JSX - use modern transform
    "jsx": "react-jsx",

    // Type declarations
    "declaration": true,
    "declarationMap": true,

    // Strict mode (highly recommended)
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Interop
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "isolatedModules": true,
    "forceConsistentCasingInFileNames": true,

    // Performance
    "skipLibCheck": true,

    // 🔴 CRITICAL: Don't emit - tsup handles this
    "noEmit": true
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Key Differences: Library vs App Config

| Setting | Library | App |
|---------|---------|-----|
| `noEmit` | `true` (bundler emits) | `false` |
| `declaration` | `true` (generate .d.ts) | Usually `false` |
| `jsx` | `"react-jsx"` (modern) | Depends |
| `moduleResolution` | `"bundler"` | `"node"` or `"bundler"` |

---

## Testing Before Publishing

### Never Skip This!

**Testing saved us from publishing broken packages multiple times.**

### Method 1: npm link (Quick Testing)

```bash
# In your library directory
npm run build
npm link

# In your test app
npm link @yourscope/package-name

# Test the import
import { Component } from "@yourscope/package-name";
```

**Unlink when done:**

```bash
# In test app
npm unlink @yourscope/package-name

# In library
npm unlink
```

**Problems with npm link:**
- Can cause React duplicate issues
- Symlink problems on Windows
- Not exactly like real install

### Method 2: npm pack (Most Realistic)

```bash
# In your library
npm run build
npm pack

# This creates: yourscope-package-name-1.0.0.tgz

# In your test app
npm install ../path/to/yourscope-package-name-1.0.0.tgz

# Test it
import { Component } from "@yourscope/package-name";
```

**This is the most realistic test** - exactly like npm install!

### Method 3: Verdaccio (Local NPM Registry)

For serious testing, run a local NPM registry:

```bash
npm install -g verdaccio
verdaccio

# Then publish to local registry
npm publish --registry http://localhost:4873
```

### Testing Checklist

Before publishing, verify:

```bash
# ✅ TypeScript check passes
npm run typecheck

# ✅ Build succeeds
npm run build

# ✅ Check what will be published
npm pack --dry-run

# ✅ Build outputs exist
ls dist/

# Should see:
# - index.js (CJS)
# - index.mjs (ESM)
# - index.d.ts (Types CJS)
# - index.d.mts (Types ESM)

# ✅ Test in real project
npm pack
cd ../test-app
npm install ../my-lib/my-lib-1.0.0.tgz

# ✅ Test both import styles
# ESM:
import { Component } from "my-lib";
# CJS:
const { Component } = require("my-lib");

# ✅ TypeScript autocomplete works
// Try typing Component. and see if types work

# ✅ Component renders
// Actually use it in your test app
```

---

## Common Pitfalls & Solutions

### Pitfall 1: Bundling React

**Problem:**

```json
{
  "dependencies": {
    "react": "^19.0.0"  // ❌ WRONG!
  }
}
```

**Error:** "Invalid Hook Call" - Two copies of React!

**Solution:**

```json
{
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "devDependencies": {
    "react": "^19.0.0"  // ✅ Only for development
  }
}
```

### Pitfall 2: Not Externalizing Dependencies

**Problem:**

```typescript
// tsup.config.ts
export default defineConfig({
  // Missing external field!
});
```

**Result:** React gets bundled into your package (huge, breaks hooks)

**Solution:**

```typescript
export default defineConfig({
  external: ["react", "react-dom"],  // ✅ Don't bundle these
});
```

### Pitfall 3: Missing "use client"

**Problem:** Component works locally, breaks in Next.js 13+ App Router

```tsx
// Your component uses hooks
import { useState } from "react";

export const Component = () => {
  const [state, setState] = useState(0);  // ❌ Error in Next.js
  // ...
};
```

**Error:** "useState cannot be used in Server Components"

**Solution:**

```tsx
"use client";  // ✅ Add this!

import { useState } from "react";

export const Component = () => {
  const [state, setState] = useState(0);
  // ...
};
```

**Or configure tsup:**

```typescript
export default defineConfig({
  banner: {
    js: '"use client";',
  },
});
```

### Pitfall 4: Importing from Source Instead of Dist

**Problem:**

```json
{
  "main": "src/index.ts"  // ❌ WRONG! Points to source
}
```

**Result:** Users get uncompiled TypeScript!

**Solution:**

```json
{
  "main": "./dist/index.js",  // ✅ Compiled output
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts"
}
```

### Pitfall 5: Publishing Source Files

**Problem:**

```json
{
  "files": ["src", "dist"]  // ❌ Don't publish src!
}
```

**Why bad:**
- Larger package size
- Confusing for users
- Source files exposed

**Solution:**

```json
{
  "files": ["dist", "README.md", "LICENSE"]  // ✅ Only built output
}
```

### Pitfall 6: Forgetting to Build Before Publish

**Problem:** Publish old/missing dist files

**Solution:** Use `prepublishOnly`

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

This **automatically builds** before `npm publish`!

### Pitfall 7: Relative Imports in README

**Problem:**

```markdown
![Preview](./preview.png)
```

**Result:** Image doesn't show on NPM (file not in package)

**Solution:** Use GitHub raw URL

```markdown
![Preview](https://raw.githubusercontent.com/username/repo/main/preview.png)
```

---

## Real-World Examples

### How Popular Libraries Do It

#### React (Meta)

```json
{
  "main": "index.js",
  "exports": {
    ".": {
      "react-server": "./react.shared-subset.js",
      "default": "./index.js"
    }
  },
  "peerDependencies": {}
}
```

**Key insights:**
- Conditional exports for React Server Components
- Minimal peer dependencies
- Simple structure

#### Radix UI

```json
{
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "sideEffects": false
}
```

**Key insights:**
- Dual ESM/CJS
- Separate type declarations for each format
- No side effects
- Uses inline styles (like our solution!)

#### Material-UI

```json
{
  "main": "./index.js",
  "module": "./esm/index.js",
  "exports": {
    ".": {
      "types": "./index.d.ts",
      "import": "./esm/index.js",
      "default": "./index.js"
    }
  },
  "dependencies": {
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  }
}
```

**Key insights:**
- CSS-in-JS approach
- Bundles emotion (runtime dependency)
- Larger but more flexible

---

## Publishing Checklist

### Before First Publish

- [ ] Choose unique package name (`npm search @scope/name`)
- [ ] Create NPM account (`npm adduser`)
- [ ] Setup 2FA on NPM
- [ ] Create GitHub repository
- [ ] Add LICENSE file
- [ ] Write comprehensive README

### Before Every Publish

```bash
# 1. Run tests
npm test

# 2. Type check
npm run typecheck

# 3. Build
npm run build

# 4. Verify build output
ls dist/
# Should see: index.js, index.mjs, index.d.ts, index.d.mts

# 5. Check package contents
npm pack --dry-run

# 6. Test locally
npm pack
npm install ../package.tgz  # In test project

# 7. Verify TypeScript types work
# Open test project in VS Code, try importing

# 8. Test in Next.js (if applicable)
# Test in Vite (if applicable)

# 9. Update version
npm version patch  # or minor, or major

# 10. Publish
npm publish --access public  # For scoped packages

# 11. Push to GitHub
git push origin main --follow-tags

# 12. Create GitHub release
gh release create v1.0.0 --generate-notes
```

### Post-Publish Verification

```bash
# Install your published package
cd /tmp
mkdir test-install
cd test-install
npm init -y
npm install @yourscope/package-name

# Test import
node -e "console.log(require('@yourscope/package-name'))"

# Check types
npx tsc --init
# Create test.ts with your import
# Run: npx tsc --noEmit test.ts
```

---

## Complete Minimal Example

Here's a complete, working example you can copy:

### src/index.tsx

```tsx
"use client";

import React from "react";

// Default styles with CSS variables for customization
const defaultStyles: React.CSSProperties = {
  padding: "var(--my-button-padding, 12px 24px)",
  backgroundColor: "var(--my-button-bg, #0070f3)",
  color: "var(--my-button-color, white)",
  border: "none",
  borderRadius: "var(--my-button-radius, 4px)",
  cursor: "pointer",
  fontSize: "var(--my-button-font-size, 16px)",
  fontWeight: "var(--my-button-font-weight, 500)",
};

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  disableDefaultStyles?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = "",
  style,
  disableDefaultStyles = false,
}) => {
  const mergedStyles = disableDefaultStyles
    ? style
    : { ...defaultStyles, ...style };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={mergedStyles}
    >
      {children}
    </button>
  );
};
```

### package.json

```json
{
  "name": "@yourscope/button",
  "version": "1.0.0",
  "description": "A customizable React button component",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.mts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  },
  "sideEffects": false,
  "files": ["dist", "README.md", "LICENSE"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build"
  },
  "peerDependencies": {
    "react": ">=18.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "react": "^19.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  },
  "keywords": ["react", "button", "component"],
  "author": "Your Name",
  "license": "MIT"
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### tsup.config.ts

```typescript
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["esm", "cjs"],
  dts: { resolve: true },
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  treeshake: true,
  target: "es2020",
  banner: { js: '"use client";' },
});
```

### .gitignore

```
node_modules/
dist/
*.log
.DS_Store
```

### .npmignore

```
src/
tsconfig.json
tsup.config.ts
.gitignore
node_modules/
*.log
```

### README.md

```markdown
# @yourscope/button

A customizable React button component.

## Installation

\`\`\`bash
npm install @yourscope/button
\`\`\`

## Usage

\`\`\`tsx
import { Button } from "@yourscope/button";

function App() {
  return <Button onClick={() => alert("Clicked!")}>Click Me</Button>;
}
\`\`\`

## Customization

### Using CSS Variables

\`\`\`css
.custom-button {
  --my-button-bg: #ff0000;
  --my-button-color: white;
  --my-button-padding: 16px 32px;
}
\`\`\`

\`\`\`tsx
<Button className="custom-button">Custom Button</Button>
\`\`\`

### Using style prop

\`\`\`tsx
<Button style={{ backgroundColor: "red", padding: "20px" }}>
  Styled Button
</Button>
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Button content |
| onClick | () => void | - | Click handler |
| disabled | boolean | false | Disabled state |
| className | string | "" | CSS class |
| style | CSSProperties | - | Inline styles |
| disableDefaultStyles | boolean | false | Disable default styles |

## License

MIT
\`\`\`

---

## Build and Test

\`\`\`bash
# Install dependencies
npm install

# Build
npm run build

# Test locally
npm pack
\`\`\`

This creates a complete, working React component library!

---

## Key Takeaways

### What Worked (From Our Experience)

✅ **Inline styles with CSS variables**
- Best developer experience
- Users don't need CSS imports
- Fully customizable via className
- No build complexity

✅ **tsup for building**
- Zero config
- Dual ESM/CJS output
- Type declarations
- Fast

✅ **Proper externalization**
- React as peer dependency
- Prevents duplicate React
- Smaller bundle

✅ **Testing with npm pack**
- Most realistic testing
- Catches real-world issues

✅ **prepublishOnly script**
- Never publish without building
- Saves from embarrassing mistakes

### What Didn't Work (Lessons Learned)

❌ **CSS Modules in libraries**
- Breaks after compilation
- Requires complex build setup
- Users get errors

❌ **Direct CSS imports**
- JavaScript can't require CSS
- Only works in applications

❌ **Using plain tsc**
- Only one output format
- No bundling
- Manual file copying

❌ **Relative paths for images in README**
- Don't work on NPM
- Use GitHub raw URLs

❌ **Forgetting "use client"**
- Breaks in Next.js App Router
- Hard to debug

### The Golden Rules

1. **Test before publishing** (npm pack is your friend)
2. **React is a peer dependency** (never bundle it)
3. **Support both ESM and CJS** (users have different setups)
4. **Use CSS variables** (best of both worlds)
5. **Types are critical** (generate .d.ts files)
6. **Build before publish** (use prepublishOnly)
7. **README images via GitHub** (use raw.githubusercontent.com)
8. **Keep it simple** (inline styles > CSS files for libraries)

---

## Conclusion

Building React NPM libraries is different from building React apps. The key is understanding that your code is pre-compiled before users see it. CSS imports, file imports, and module resolution all work differently.

**This guide is based on real experience** fixing a completely broken package. Every recommendation comes from actual problems we encountered and solved.

Use this guide as a reference, and you'll save yourself days of debugging and user complaints.

Happy building! 🚀

---

## Additional Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [tsup Documentation](https://tsup.egoist.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Server Components](https://react.dev/reference/react/use-client)
- [Node Package Exports](https://nodejs.org/api/packages.html#exports)

---

**Questions or issues?** Open an issue on GitHub or contribute improvements to this guide.

**Last updated:** January 2026
