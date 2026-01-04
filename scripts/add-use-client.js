#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const files = ["dist/index.js", "dist/index.mjs"];

files.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf-8");

    // Skip if "use client" is already at the top
    if (content.startsWith('"use client";')) {
      console.log(`✓ "use client" already present in ${file}`);
      return;
    }

    // Add "use client" at the top
    content = `"use client";\n${content}`;

    // Remove duplicate sourceMappingURL comments (keep only the last one)
    const sourceMapRegex = /\/\/# sourceMappingURL=(.+)/g;
    const matches = [...content.matchAll(sourceMapRegex)];

    if (matches.length > 1) {
      // Keep only the last sourceMappingURL
      const lastMatch = matches[matches.length - 1];
      content = content.replace(sourceMapRegex, '');
      content = content.trimEnd() + '\n' + lastMatch[0];
    }

    fs.writeFileSync(filePath, content);
    console.log(`✓ Added "use client" to ${file}`);
  }
});
