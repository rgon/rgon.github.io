const fs = require("fs");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy( { "src/js": "js" } );
  eleventyConfig.addPassthroughCopy( { "src/css": "css" } );
  // Find and copy any `jpg` files, maintaining directory structure.
  eleventyConfig.addPassthroughCopy( { "src/**/*.jpg": "img" } );
  eleventyConfig.addPassthroughCopy( { "src/**/*.svg": "logo" } );

  eleventyConfig.addFilter("filesize", function(path) {
    let stat = fs.statSync('src/img/' + path);
    if (stat) {
      return (stat.size/1024).toFixed(2) + " KB";
    }
    return "";
  });

  // Return your Object options:
  return {
    dir: {
      input: "src",
      output: "docs"
    }
  }
};
