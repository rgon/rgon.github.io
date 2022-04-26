/*
Implements drag-to-scroll on PC. Also removes the scrollbars on PC for aesthetic reasons.
In touch devices, only prevents dragging of child elements (but not drag-to-scroll).

Non-destructive if noscript is enabled.
*/
let pos = { top: 0, left: 0, x: 0, y: 0 }
var currentlyDraggedElement = undefined

function isTouchDevice(){
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0))
}

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x
    const dy = e.clientY - pos.y
    
    currentlyDraggedElement.classList.add('dragging')

    // Scroll the element
    currentlyDraggedElement.scrollTop = pos.top - dy
    currentlyDraggedElement.scrollLeft = pos.left - dx
}
const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)

    currentlyDraggedElement.classList.remove('dragging')
    currentlyDraggedElement.style.removeProperty('user-select')
    currentlyDraggedElement = undefined
}

const mouseDownHandler = function (e) {
    currentlyDraggedElement = e.target.closest('.dragToScroll')

    pos = {
        // The current scroll
        left: currentlyDraggedElement.scrollLeft,
        top: currentlyDraggedElement.scrollTop,
        // Get the current mouse position
        x: e.clientX,
        y: e.clientY,
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
}

for (let dtsElem of document.getElementsByClassName('dragToScroll')) {
    if (!isTouchDevice()) {
        dtsElem.style.overflow = 'hidden'
    }
    dtsElem.addEventListener('mousedown', mouseDownHandler)

    for (let directChild of document.querySelectorAll('.dragToScroll a')) {
        console.log(directChild)
        // Prevent dragging links
        directChild.addEventListener('dragstart', (e) => {
            e.preventDefault()
        })

        // Prevent mouse clicks when grabbing, allow if clean click
        directChild.addEventListener('mouseup', (e) => {
            console.log(e.target.closest('a'))
            console.log(e.target.closest('.dragToScroll'))
            if (e.target.closest('.dragToScroll').matches('.dragging')) {
                console.log('preventing', e.target)
                e.stopPropagation()
                e.stopImmediatePropagation()
                e.preventDefault()
            }
            return false
        })
    }
}