const path = require("path");

const themeEntries = require('./themes.js').themeEntries;
const extractThemesPlugin = require('./themes.js').extractThemesPlugin;
module.exports = require('./buildConfig')(
    {
        "mapstore2": path.join(__dirname, "..", "web", "client", "product", "app")
    },
    { ["themes/neftex"]: themeEntries["themes/" + (process.env.theme || "neftex")]},
    {
        base: path.join(__dirname, ".."),
        dist: path.join(__dirname, "..", "web", "client", "dist"),
        framework: path.join(__dirname, "..", "web", "client"),
        code: path.join(__dirname, "..", "web", "client")
    },
    extractThemesPlugin,
    false,
    "dist/"
);