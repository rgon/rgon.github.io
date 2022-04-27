/*
Implements drag-to-scroll on PC. Also removes the scrollbars on PC for aesthetic reasons.
In touch devices, only prevents dragging of child elements (but not drag-to-scroll).

Non-destructive if noscript is enabled.
*/
// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

let pos = { top: 0, left: 0, x: 0, y: 0 }
var currentlyDraggedElement = undefined
let isDragging = false

function isTouchDevice(){
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0))
}

function draggingCallback (dragging=true) {
    if (dragging){
        currentlyDraggedElement.classList.add('dragging')
    } else {
        currentlyDraggedElement.classList.remove('dragging')
    }
}

const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x
    const dy = e.clientY - pos.y
    
    if (!isDragging) {
        isDragging = true
        draggingCallback()
    }

    // Scroll the element
    currentlyDraggedElement.scrollTop = pos.top - dy
    currentlyDraggedElement.scrollLeft = pos.left - dx
}
const mouseUpHandler = function () {
    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)

    isDragging=false
    draggingCallback(isDragging)
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
}

// @license-end