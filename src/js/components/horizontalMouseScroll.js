/*
Captures mousewheel scroll on pc and scrolls horizontally with the mousewheel if possible.
If not, returns focus to the parent scrolling container.

Doesn't interfere with horizontally-scrolling mouse wheels.
Non-destructive if noscript is enabled.
*/

function scrollHandler (e) {
    let scrolledElement = e.target.closest('.horizontalMouseScroll')
    // scrolledElement.scrollLeft += e.deltaY
    scrolledElement.scrollBy({left: e.deltaY * 4, behavior: 'smooth'})
    
    if ((e.deltaY < 0 && scrolledElement.scrollLeft <= 0) || (e.deltaY > 0 && scrolledElement.scrollLeft >= scrolledElement.scrollLeftMax)) {
        // end, scroll normally
    } else {
        e.preventDefault()
    }
}

for (let hmsElem of document.getElementsByClassName('horizontalMouseScroll')) {
    hmsElem.addEventListener('wheel', scrollHandler)
}