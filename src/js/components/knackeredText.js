function cleanBreak(str) {
    return str
        .replace(/<br >/g, "<br>")
        .replace(/<br \/>/g, "<br>")
        .replace(/<br\/>/g, "<br>");
}
function isAllowedChar(c) {
    return c !== " " && c !== "\n" && c !== "\r"
}
const knackChars = "$&[{}(=*)+]!#/@_-?^|%"

function knackeredTextBegin () {
    // -- knackered text animation
    for (let elem of document.getElementsByClassName('knackered')) {
        if (!elem.getAttribute('aria-label')) {
            elem.setAttribute('aria-label', cleanBreak(elem.innerHTML).trim())
        }
    }
    
    window.setInterval(() => {
        for (let elem of document.getElementsByClassName('knackered')) {
            let content = elem.getAttribute('aria-label')
            rndIdx = Math.floor(Math.random() * (content.length - 1))
            while (!isAllowedChar(content[rndIdx]) && rndIdx < content.length) rndIdx++ // Changing spaces or newline causes reflows
            while (!isAllowedChar(content[rndIdx]) && rndIdx > 0) rndIdx--
            
            content[Math.floor(Math.random() * content.length)] = knackChars[Math.floor(Math.random() * knackChars.length)]
            elem.innerHTML = content.substring(0, rndIdx) + knackChars[Math.floor(Math.random() * knackChars.length)] + content.substring(rndIdx + 1)
        }
    }, 200)
}