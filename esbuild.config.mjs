#!/usr/bin/env node

import * as esbuild from "esbuild";

let config = {
    entryPoints: ["client/main.jsx"],
    outfile: "public/main.js",
    bundle: true,
    minify: true,
    target: "ES6",
    loader: {
        ".png": "file",
        ".jpg": "file",
    },
    plugins: [
        {
            name: "start/end",
            setup(build) {
                build.onStart(() => {
                    console.log("Beginning build...");
                });
                build.onEnd((result) => {
                    console.log(`Build completed with ${result.errors.length} error(s).`);
                });
            },
        },
    ],
};

let watch = false;

process.argv.forEach((arg, idx) => {
    if (idx === 0 || idx === 1) {
        return;
    }

    if (arg === "--watch") {
        watch = true;
    } else if (arg === "--no-minify") {
        config.minify = false;
    }
});

if (watch) {
    await (await esbuild.context(config)).watch();
    console.log("Watching files...");
} else {
    await esbuild
        .build(config)
        .catch((e) => {
            console.log("Error building:", e.message);
            process.exit(1);
        });
}
