---
tags: 
  - posts
  - automotive
  - reverse engineering
  - open source
title: Reverse-engineering RF TPMS sensors and developing a Linux client to analyze them
description: Disassembling an Android app provided by the chinese vendor of TPMS sensors revealed they communicate with a USB-Serial protocol and simple commands. The binary file included pressure and temperature coefficients which would've been difficult to get otherwise.
coverImage: img/wip.svg
# coverVideo: /vid/vid3.mp4
---

En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. 

Editar tode.

## The code
``` log
Copied 21 files / Wrote 4 files in 0.14 seconds (v0.12.1)
Watching…
[Browsersync] Reloading Browsers...
File changed: src/_includes/blogpost.liquid
Writing dist/posts/README/index.html from ./src/posts/README.md.
Writing dist/posts/post2/index.html from ./src/posts/post2.md.
Writing dist/posts/post3/index.html from ./src/posts/post3.md.
Writing dist/index.html from ./src/index.liquid.
Copied 21 files / Wrote 4 files in 0.12 seconds (v0.12.1)
Watching…
[Browsersync] Reloading Browsers...
File changed: src/_includes/blogpost.liquid
Writing dist/posts/README/index.html from ./src/posts/README.md.
Writing dist/posts/post3/index.html from ./src/posts/post3.md.
Writing dist/posts/post2/index.html from ./src/posts/post2.md.
Writing dist/index.html from ./src/index.liquid.
Copied 21 files / Wrote 4 files in 0.14 seconds (v0.12.1)
Watching…
[Browsersync] Reloading Browsers...
File changed: src/_includes/blogpost.liquid
Writing dist/posts/README/index.html from ./src/posts/README.md.
Writing dist/posts/post2/index.html from ./src/posts/post2.md.
Writing dist/posts/post3/index.html from ./src/posts/post3.md.
Writing dist/index.html from ./src/index.liquid.
Copied 21 files / Wrote 4 files in 0.14 seconds (v0.12.1)
Watching…
```
## And some shitcode for your pleasure
``` js
//Calculates x² of an integer up to ±1 million
var square = (function () {
	var s = "if(A==B){return C;}";
	var func = "var A=Math.abs(D|0);";
	for (var i = 0; i <= 1000000; i++) {
		func += s.replace(/B/, i).replace(/C/, i * i);
	}
	return new Function("D", func + "return Infinity;");
})();
```
### Code review
This code has been extracted from [shitcode](https://shitcode.net).

## The Veredict
El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quijana. Pero esto importa poco a nuestro cuento: basta que en la narración dél no se salga un punto de la verdad.

## For your viewing pleasure
{% image "img/wip.svg", "Don Quixote de la libre mancha" %}