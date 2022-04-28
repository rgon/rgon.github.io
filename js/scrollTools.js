/*
Useful scroll detection tools
For page sections and sticky headers.

April 2022
by github.com/rgon
-----

detectSticky options:
    {
        threshold -> array of [% of item height in [0, 1]]: 1=full item, 0.5=half height
            A threshold of zero triggers the intersection when the first pixel of the target element intersects the root element. 
            A threshold of one triggers when the entire target element is inside the root element.
        rootMargin -> t r b l: '0px 0px -50% 0px' = triggers when passing half the screen
            does not work if the root element is not an actual element on the page, such as the viewport.
*/

// @license magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later

// Because the handleIntersection callback is run on the main thread, be careful to only perform logic that is absolutely necessary and keep this logic lean.
function detectSticky(stickyElem, callBack=undefined, options=undefined) {
    if (stickyElem) {
        // position: sticky detection: adds .sticking when sticking
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(e => {
                    e.target.classList.toggle('sticking', e.isIntersecting)
                    if (callBack) callBack(e)
                })
            },
            options ? options : {
                rootMargin: '0px 0px -100% 0px', // Boundary to a 0px line in the top. Thus, always intersects, no top: -1px hack needed.
                threshold: 0
            }
        );
    
        if (!!stickyElem.forEach) {
            stickyElem.forEach(element => {
                observer.observe(element)
            });
        } else {
            observer.observe(stickyElem)
        }
    }
}

function detectScroll(elem, callBack=undefined, options=undefined, callbackAtStart=true) { // threshold: percentage of the element that has to be scrolled past
    if (elem) {
        const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(e => {
                        if (callBack) callBack(Object.assign(e, {'scrolled': e.boundingClientRect.top < e.intersectionRect.top}))
                    })
                },
                options ? options : {threshold: [0, 0.5]} // by default, if scrolled past half
            );
        
        /*
        // Check now if the element is scrolled by (on load): prevents href="#"/coming dack to the tab bug
        if (elem.getBoundingClientRect().y <= 0 && callbackAtStart) {
            if (callBack) callBack({target: elem})
        }*/
    
        if (!!elem.forEach) {
            elem.forEach(e => {
                observer.observe(e)
            });
        } else {
            observer.observe(elem)
        }
    }
}