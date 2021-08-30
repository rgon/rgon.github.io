
function detectSticky(stickyElem, callBack=undefined) {
    // position: sticky detection: adds .sticking when sticking
    const observer = new IntersectionObserver(
        ([e]) => {
            // If we don't check here, elements intersecting with the bottom of the screen will also trigger the observer
            if (e.target.getBoundingClientRect().y <= (parseFloat(window.getComputedStyle(e.target).top) + 1) // Adding threshold to prevent slow scroll bug
            ||
            e.target.classList.contains('sticking') // Also trigger if it has the sticky class, on Leave
            ) {
            e.target.classList.toggle('sticking', e.intersectionRatio < 1)
            if (callBack) {
                callBack(e)
            }
            }
        },
        {threshold: [1]}
    );
    // Check now if the element is sticking (on load): prevents href="#"/coming dack to the tab bug
    if (stickyElem.getBoundingClientRect().y <= (parseFloat(window.getComputedStyle(stickyElem).top) + 1)) {
        stickyElem.classList.remove('sticking') // Also trigger if it has the sticky class, on Leave
    }

    observer.observe(stickyElem)
}