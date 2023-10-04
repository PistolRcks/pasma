#!/usr/bin/env node

import * as esbuild from "esbuild";

await esbuild
  .build({
    entryPoints: ["client/main.jsx"],
    outfile: "public/bundle.js",
    bundle: true,
    minify: true,
    target: "ES6",
    loader: { 
      '.png': 'file',
      '.jpg': 'file'
     },
    plugins: [esbuildEnvfilePlugin],
  })
  .then((r) => console.log("Build succeeded."))
  .catch((e) => {
    console.log("Error building:", e.message);
    process.exit(1)
  });
