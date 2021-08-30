
const stickyElem = document.querySelector('header')
// position: sticky detection
const observer = new IntersectionObserver( 
  ([e]) => {
      // If we don't check here, elements intersecting with the bottom of the screen will also trigger the observer
      if (e.target.getBoundingClientRect().y <= (parseFloat(window.getComputedStyle(e.target).top) + 1) // Adding threshold to prevent slow scroll bug
        ||
        e.target.classList.contains('sticking') // Also trigger if it has the sticky class, on Leave
      ) {
        e.target.classList.toggle('sticking', e.intersectionRatio < 1)
        e.target.classList.remove("expanded")
      }
  },
  {threshold: [1]}
);
observer.observe(stickyElem)


document.getElementById("expandHeader").addEventListener('click', (event) => {
    console.log('expand')
    document.getElementsByTagName("header")[0].classList.toggle("expanded")
})