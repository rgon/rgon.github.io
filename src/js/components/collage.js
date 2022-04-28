/*
Helper script for CSS Grid collage.
Implements tap-to preview collage item on mobile, since touch devices can't hover.

April 2022
by github.com/rgon
-----

*/
// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

let activeElementsExist = false
function removeOtherActive () {
    for (let activeItem of document.querySelectorAll('.collage .active')) {
        activeItem.classList.remove('active')
    }
}
function scrollCallback (dragging=true) {
    removeOtherActive()
}

const observer = new IntersectionObserver(scrollCallback, {
    root: document.querySelector('.collage'),
    rootMargin: '0px',
    threshold: 1.0
});

for (let itemInCollage of document.querySelectorAll('.collage .item')) {
    itemInCollage.addEventListener('touchend', (e) => {
        removeOtherActive()
        activeElementsExist = true
        itemInCollage.classList.add('active')
    })
    itemInCollage.addEventListener('mousemove', (e) => {
        removeOtherActive()
    })
}
for (let aInCollage of document.querySelectorAll('.collage a')) {
    aInCollage.addEventListener('dragstart', (e) => {
        e.preventDefault()
    })
}


document.querySelector('.collage').addEventListener('scroll', function(e) {
    if (activeElementsExist) scrollCallback()
})    
// @license-end