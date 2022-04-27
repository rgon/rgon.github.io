// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

detectSticky(document.querySelector('header:not(.fixed)'), (e) => {
      e.target.classList.remove("expanded")
})

document.getElementById("expandHeader").addEventListener('click', (event) => {
    console.log('expand')
    document.getElementsByTagName("header")[0].classList.toggle("expanded")
})

// @license-end