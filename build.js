const fs = require("fs");
const cssmin = require("cssmin");
const { minify } = require("terser");

async function build() {
  try {
    const cssStyles = fs.readFileSync("src/styles.css").toString();
    let scriptContents = fs.readFileSync("src/script.js").toString();

    scriptContents = scriptContents.replace(/%CSS%/, cssmin(cssStyles));

    fs.writeFileSync("dist/github-cr-toolbox.user.js", scriptContents);

    scriptContents = (await minify(scriptContents)).code;

    fs.writeFileSync("dist/extension.js", scriptContents);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

build();
