detectSticky(document.querySelector('header:not(.isfirst)'), (e) => {
      e.target.classList.remove("expanded")
})

document.getElementById("expandHeader").addEventListener('click', (event) => {
    console.log('expand')
    document.getElementsByTagName("header")[0].classList.toggle("expanded")
})