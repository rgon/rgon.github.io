const fs = require("fs");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

const slugify = require("slugify");
const pluginTOC = require('eleventy-plugin-toc')
const markdownItAnchor = require("markdown-it-anchor")
const markdownIt = require("markdown-it")

const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const OUTPUTDIR = './docs'
const HIDDENTAGS = {'posts': 0, 'projects': 0}

const ImageWidths = {
  ORIGINAL: null,
  PLACEHOLDER: 24,
};

async function imageShortcode(src, alt, _class, sizes) {
  const metadata = await Image('src' + (src[0] === '/' ? '' : '/') + src, {
    widths: [ImageWidths.ORIGINAL, ImageWidths.PLACEHOLDER, 600, 1280],
    outputDir: OUTPUTDIR + "/img/",
    formats: ["avif", "webp", "jpeg"]
  });

  // console.log(src, alt, sizes)

  const imageAttributes = {
    class: (_class ? _class : ''),
    alt: (alt ? alt : ''),
    sizes: sizes ? sizes : "(min-width: 1024px) 100vw, 50vw",
    loading: "lazy",
    decoding: "async",
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // -- asset bundling
  eleventyConfig.addPassthroughCopy( { "src/robots.txt": "" } );
  eleventyConfig.addPassthroughCopy( { "src/js": "js" } );
  eleventyConfig.addPassthroughCopy( { "src/css": "css" } );
  eleventyConfig.addPassthroughCopy( { "src/imgPassthrough/**/*.jpg": "img" } );
  eleventyConfig.addPassthroughCopy( { "src/**/*.svg": "logo" } );

  // -- syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight, {
    alwaysWrapLineHighlights: true,
  });

  // -- table of contents
  function removeExtraText(s) {
		let newStr = String(s).replace(/New\ in\ v\d+\.\d+\.\d+/, "");
		newStr = newStr.replace(/Coming\ soon\ in\ v\d+\.\d+\.\d+/, "");
		newStr = newStr.replace(/⚠️/g, "");
		newStr = newStr.replace(/[?!]/g, "");
		newStr = newStr.replace(/<[^>]*>/g, "");
		return newStr;
	}

  // -- slugify and Table of Contents
	function markdownItSlugify(s) {
    return slugify(removeExtraText(s), { lower: true, remove: /[:’'`,]/g });
  }
	const mdIt = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	})
	.use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.headerLink(),
		slugify: markdownItSlugify,
		permalinkBefore: false,
		permalinkClass: "direct-link",
		permalinkSymbol: "#",
		level: [1,2,3,4]
	})
	// mdIt.linkify.tlds('.io', false);
	eleventyConfig.setLibrary("md", mdIt)
  // If you're using Nunjucks, include the safe filter:
  eleventyConfig.addPlugin(pluginTOC)

  // -- image optmization
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  // -- sitemap generation https://www.npmjs.com/package/@quasibit/eleventy-plugin-sitemap
  eleventyConfig.addPlugin(sitemap, {
    lastModifiedProperty: "modified",
    sitemap: {
      hostname: "https://rgon.es",
    },
  })

  // -- convenience filters
  eleventyConfig.addFilter("trimString", function (str, len) { // Used to generate <title> and <meta name="description">, amongst others
    str = String(str).trimRight() // Remove trailing spaces

    if (str.length > len) {
      if (len > 7) { // Minimum length, if not the ellipsis would take up most of the characters
        let foundWordEnd = -1
        // Find latest word end up until -n chars (in case an extremely long word appears)
        // This way, words will not be broken down when trimmed
        for (let i = 0; i < 7; i++) {
          if (str[len - 4 - i] === " ") { // -1 for index, -3 for ellipsis
            foundWordEnd = (len - 4 - i)
            break
          }
        }
        if (foundWordEnd != -1) {
          // Trim word and add ellipsis
          str = str.substring(0, foundWordEnd) + '...'
        } else {
          // If last word not found or too long, just
          str = str.substring(0, len-3) + '...'
        }
      } else {
        str = str.substring(0, len)
      }
    } // else return string

    return str
  });

  // -- convenience filters
  eleventyConfig.addFilter("filterTags", function(tags) {
    if (tags) return tags.filter(tag => !(tag in HIDDENTAGS))
  });

  // -- convenience filters
  eleventyConfig.addFilter("arrayToString", function(arr) {
    if (arr) return arr.join(", ")
  });

  // -- convenience filters
  eleventyConfig.addFilter("filesize", function(path) {
    const stat = fs.statSync('src/img/' + path);
    if (stat) {
      return (stat.size/1024).toFixed(2) + " KB";
    }
    return "";
  });

  // -- eleventy run
  return {
    dir: {
      input: "src",
      output: OUTPUTDIR,
    }
  }
};
