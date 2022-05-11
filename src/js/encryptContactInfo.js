/*
Implements simple encryption and decryption of email addresses and phone numbers in order to fool spambots.
Not intended to be secure, only to keep automated scripts out.

April 2022 -> May 2022
by github.com/rgon
-----
The encrypted address is read from the innerHTML from the link. The href tag can contain bogus content.
.encMail and .encPhone addresses get decrypted by the decryptAll* functions

usage:
    <a class="encMail" href="?Subject=Hello Stranger!">h4h4h@ho2nN2hd.H4h</a>
    -- or --
    <a class="encMail" href="mailto:mailme@example.com?Subject=Hello Stranger!">h4h4h@ho2nN2hd.H4h</a>

    <a class="encPhone" href="tel:(+XX)6XXXXXXXX">h2d6hdu2h4hU2</a>

    // on load, or better, on other complex event
    window.addEventListener('load', () => {
        decryptAllAddressesOnPage(yourpassword)
        decryptAllPhoneNumbersOnPage(yourpassword)
    })
-----

Allowed phone formats:
    +XX 6XXXXXXXX
    (+XXX) 6XXXXXXXX
    6XXXXXXXX
-----

Maintains the '.tld' and @ symbols so the bots don't think it's encrypted.

If the bots interpret the result of the website, this is of no use, but since that operation
is time consuming, we don't expect it to happen.

This is just an attempt at obfuscation for bots, not any sort of encryption.

[More info here](http://www.grall.name/posts/1/antiSpam-emailAddressObfuscation.html)

Caesar ciphers are very commonly used for this purpose, including ROT13. Just to be different,
I'm implementing a Vigenere cypher. Just 5 centuries late.

*/
// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

// Normally 26 letters in the alphabet, but we can include more with a custom charCodeAt function
// Uppercase [A-Z] chars have a lower char value, so we could include 32+26 easily without producing non-standard chars
// In this case, we're using numbers as well, so 26 + 10 = 36
const vigenereModulus = 36
const aOffset = 'a'.charCodeAt()
const numOffset = '0'.charCodeAt()

function atoi (c) {
    c = c.charCodeAt()
    if (c < (26 + aOffset) && c >= aOffset) { // if is a lowercase char
        return c - aOffset
    } else if (c >= numOffset && c < (10 + numOffset)) { // is a num offset
        return c - numOffset + 26
    } else {
        return c.charCodeAt + vigenereModulus
    }
}
function itoa (i) {
    if (i < 26) {
        return String.fromCharCode(i + aOffset)
    } else if (i < vigenereModulus) {
        return String.fromCharCode(i - 26 + numOffset)
    } else {
        return String.fromCharCode(i - vigenereModulus)
    }
}
function encryptStr (str, pass) { // [a-z],[0-9]
    let encString = ''
    str = str.toLowerCase()
    pass = pass.toLowerCase()

    // Vigenere cypher implementation
    for (let i=0; i<str.length; i++) {
        const passCode = atoi(pass[i % pass.length])
        const iVal = atoi(str[i])

        // Caesar cypher sequence
        if (iVal < vigenereModulus) encString += itoa((iVal + passCode) % vigenereModulus)
        else encString += str[i]
    }

    return encString
}
function decryptStr (str, pass) {
    let decString = ''
    str = str.toLowerCase()
    pass = pass.toLowerCase()

    // Vigenere cypher implementation
    for (let i=0; i<str.length; i++) {
        const passCode = atoi(pass[i % pass.length])
        const iVal = atoi(str[i])
        const decypheredChar = (iVal - passCode)
        
        // Now that we subtract the passCode, we may get negative numbers. Roll back to the last char in that case
        if (iVal < vigenereModulus) decString += itoa((decypheredChar > 0 ? decypheredChar : decypheredChar + vigenereModulus) % vigenereModulus)
        else decString += str[i]
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
        if (typeof fullMailString !== 'string') throw new Error('Constructor requires a string with an email address.')
        
        this.tld = fullMailString.split('.').reverse()[0]
        fullMailString = fullMailString.split('.').slice(0, -1).join('.').split('@')
        this.domain = fullMailString[1]
        this.address = fullMailString[0]
    }
}

class PhoneNumber {
    number = ''
    prefix = ''
    prefixStyle = '+'
    isEncrypted = false

    encrypt (pass) {
        this.number = encryptStr(this.number, pass)
        this.prefix = encryptStr(this.prefix, pass)
        
        this.isEncrypted = true
        return this
    }
    decrypt (pass) {
        this.number = decryptStr(this.number, pass)
        this.prefix = decryptStr(this.prefix, pass)

        this.isEncrypted = false
        return this
    }
    toString (spaceOutPhoneNumber=true) {
        let number = ''

        let numberArray = []
        numberArray.push(this.number.substring(0, 3))
        numberArray.push(...this.number.substring(3).match(/.{1,2}/g))

        if (spaceOutPhoneNumber) number = numberArray.join(' ')
        else number = numberArray.join('')
        
        if (this.prefix === '') {
            return number
        } else {
            if (this.prefixStyle === '(+') {
                return this.prefixStyle + this.prefix + ')' + (spaceOutPhoneNumber ? ' ' : '') + number
            } else return this.prefixStyle + this.prefix + ' ' + number
        }
    }

    constructor(str) {
        if (typeof str !== 'string') throw new Error('Constructor requires a string with a phone number.')
        
        /*
        Recognizes prefixes of the type:
            +XX 6XXXXXXX
            (+XX)6XXXXXXX | does't require, but can contain spaces
            (+XX) 6XXXXXXX
            00XX 40XXXXXXX
        Allowed format examples:
            +XX 6XXXXXXXX
            +XX 400 05 05 43
            (+XXX) 6XXXXXXXX
            0044 440440450
            0034 400 004 004
            6XXXXXXXX
            6XX XXX XXX | and its variants
        */
        str = str.trim()
        let number = ''
        let prefix = ''

        if (str.includes('(')) {
            prefix = str.split(')')[0].split('+')[1]
            number = str.split(')').slice(1)
            this.prefixStyle = '(+'
        } else if (str.includes('+')) {
            prefix = str.split(' ')[0]
            number = str.split(' ').slice(1)
            this.prefixStyle = '+'
        } else if (str.startsWith('00')) {
            prefix = str.split(' ')[0]
            number = str.split(' ').slice(1)
            this.prefixStyle = '00'
        } else {
            number = str.split(' ')
        }
        number = number.join('')
        
        this.number = number.replace(' ', '').trim()
        this.prefix = prefix.replace('', ' ').replace('+', '').trim()
    }
}

function decryptAllAddressesOnPage(pass, tagClass='encMail') {
    for (let addr of document.querySelectorAll('.' + tagClass)) {
        try {
            const target = addr.href.split('?')
            let targetSuffix = ''
            if (target.length > 1) targetSuffix = target[1]
    
            const thisAddress = new MailAddress(addr.innerHTML)
            thisAddress.decrypt(pass)

            addr.href = 'mailto:' + thisAddress.toString() + ((targetSuffix != '') ? ('?' + targetSuffix) : '')
            addr.innerHTML = thisAddress.toString()
            addr.classList.remove(tagClass)
        } catch (e) {
            console.error("Error decrypting email address.", e)
        }
    }
}
function decryptAllPhoneNumbersOnPage(pass, tagClass='encPhone') {
    for (let addr of document.querySelectorAll('.' + tagClass)) {
        try {
            const target = addr.href.split('?')
            let targetSuffix = ''
            if (target.length > 1) targetSuffix = target[1]

            const thisAddress = new PhoneNumber(addr.innerHTML)
            thisAddress.decrypt(pass)

            addr.href = 'tel:' + thisAddress.toString(false) + ((targetSuffix != '') ? ('?' + targetSuffix) : '')
            addr.innerHTML = thisAddress.toString()
            addr.classList.remove(tagClass)
        } catch (e) {
            console.error("Error decrypting phone numbers.", e)
        }
    }
}

// @license-end