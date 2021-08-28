const fs = require("fs");

module.exports = function(eleventyConfig) {
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
      output: "dist"
    }
  }
};
