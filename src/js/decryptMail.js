/*
Implements simple encryption and decryption of email addresses in order to fool spambots.
Not intended to be secure, only to keep automated scripts out.

Maintains the '.tld' and @ symbols so the bots don't think it's encrypted.

If the bots interpret the result of the website, this is of no use, but since that operation
is time consuming, we don't expect it to happen.

This is just an attempt at obfuscation for bots, not any sort of encryption.

[More info here](http://www.grall.name/posts/1/antiSpam-emailAddressObfuscation.html)

Caesar ciphers are very commonly used for this purpose, including ROT13. Just to be different,
I'm implementing a Vigenere cypher. Just 5 centuries late.

usage:
    <a class="encMail" href="?Subject=Hello Stranger!">h4h4h@ho2nN2hd.H4h</a>
    -- or --
    <a class="encMail" href="mailto:mailme@example.com?Subject=Hello Stranger!">h4h4h@ho2nN2hd.H4h</a>

    // on load, or better, on other complex event
    window.addEventListener('load', () => {
        decryptAllAddressesOnPage(yourpassword)
    })
*/
// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

// Normally 26 letters in the alphabet, but we can include more with a custom charCodeAt function
// Uppercase [A-Z] chars have a lower char value, so we could include 32+26 easily without producing non-standard chars
// TODO
const vigenereModulus = 26

function encryptStr (str, pass) { // [a-z]
    let encString = ''
    const aOffset = 'a'.charCodeAt()
    str = str.toLowerCase()
    pass = pass.toLowerCase()

    // Vigenere cypher implementation
    for (let i=0; i<str.length; i++) {
        const passCode = pass[i % pass.length].charCodeAt() - aOffset

        // Caesar cypher sequence
        encString += String.fromCharCode((str[i].charCodeAt() - aOffset + passCode) % vigenereModulus + aOffset)
    }

    return encString
}
function decryptStr (str, pass) {
    let decString = ''
    const aOffset = 'a'.charCodeAt()
    str = str.toLowerCase()
    pass = pass.toLowerCase()

    // Vigenere cypher implementation
    for (let i=0; i<str.length; i++) {
        const passCode = pass[i % pass.length].charCodeAt() - aOffset
        const decypheredChar = (str[i].charCodeAt() - aOffset - passCode)
        
        // Now that we subtract the passCode, we may get negative numbers. Roll back to the last char in that case
        decString += String.fromCharCode((decypheredChar > 0 ? decypheredChar : decypheredChar + vigenereModulus) % vigenereModulus + aOffset)
    }

    return decString
}
function testVigenere(str, pass) {
    const encStr = encryptStr(str, pass)
    const decStr = decryptStr(encStr, pass)
    console.log(str, encStr, decStr)
}

class MailAddress {
    address = ''
    domain = ''
    tld = ''
    isEncrypted = false

    encrypt (pass) {
        this.address = encryptStr(this.address, pass)
        this.domain = encryptStr(this.domain, pass)
        this.tld = encryptStr(this.tld, pass)
        
        this.isEncrypted = true
        return this
    }
    decrypt (pass) {
        this.address = decryptStr(this.address, pass)
        this.domain = decryptStr(this.domain, pass)
        this.tld = decryptStr(this.tld, pass)
        
        this.isEncrypted = false
        return this
    }
    toString() {
        return this.address + '@' + this.domain + '.' + this.tld
    }

    constructor(fullMailString) {
        this.tld = fullMailString.split('.')[1]
        fullMailString = fullMailString.split('.')[0].split('@')
        this.domain = fullMailString[1]
        this.address = fullMailString[0]
    }
}

function decryptAllAddressesOnPage(pass, tagClass='encMail') {
    for (let addr of document.querySelectorAll('.' + tagClass)) {
        try {
            const mailTo = addr.href.split('?')
            let mailToSuffix = ''
            if (mailTo.length > 1) mailToSuffix = mailTo[1]
    
            const thisAddress = new MailAddress(addr.innerHTML)
            thisAddress.decrypt(pass)

            addr.href = 'mailto:' + thisAddress.toString() + '?' + mailToSuffix
            addr.innerHTML = thisAddress.toString()
            addr.classList.remove(tagClass)
        } catch (e) {
            console.error("Error decrypting email address.", e)
        }
    }
}

// @license-end