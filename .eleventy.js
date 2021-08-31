const fs = require("fs");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

const slugify = require("slugify");
const pluginTOC = require('eleventy-plugin-toc')
const markdownItAnchor = require("markdown-it-anchor")
const markdownIt = require("markdown-it")

const OUTPUTDIR = './docs'
const HIDDENTAGS = {'posts': 0, 'projects': 0}

async function imageShortcode(src, alt, sizes) {
  let metadata = await Image('src' + (src[0] === '/' ? '' : '/') + src, {
    widths: [300, 600],
    outputDir: OUTPUTDIR + "/img/",
    formats: ["avif", "webp", "jpeg"]
  });

  let imageAttributes = {
    alt,
    sizes: sizes ? sizes : "100vw",
    loading: "lazy",
    decoding: "async",
  };

  // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // -- asset bundling
  eleventyConfig.addPassthroughCopy( { "src/js": "js" } );
  eleventyConfig.addPassthroughCopy( { "src/css": "css" } );
  // eleventyConfig.addPassthroughCopy( { "src/**/*.jpg": "img" } );
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

	function markdownItSlugify(s) {
    return slugify(removeExtraText(s), { lower: true, remove: /[:’'`,]/g });
  }

	let mdIt = markdownIt({
		html: true,
		breaks: true,
		linkify: true
	})
	.use(markdownItAnchor, {
		permalink: true,
		slugify: markdownItSlugify,
		permalinkBefore: false,
		permalinkClass: "direct-link",
		permalinkSymbol: "#",
		level: [1,2,3,4]
	})
  /*
	.use(markdownItToc, {
		includeLevel: [2, 3],
		slugify: markdownItSlugify,
		format: function(heading) {
			return removeExtraText(heading);
		},
		transformLink: function(link) {
			// remove backticks from markdown code
			return link.replace(/\%60/g, "");
		}
	}); */

	// mdIt.linkify.tlds('.io', false);
	eleventyConfig.setLibrary("md", mdIt)
  // If you're using Nunjucks, include the safe filter:
  eleventyConfig.addPlugin(pluginTOC)

  // -- image optmization
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addLiquidShortcode("image", imageShortcode);
  eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  eleventyConfig.addFilter("filterTags", function(tags) {
    if (tags) return tags.filter(tag => !(tag in HIDDENTAGS))
  });

  eleventyConfig.addFilter("arrayToString", function(arr) {
    if (arr) return arr.join(", ")
  });

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
      output: OUTPUTDIR
    }
  }
};
