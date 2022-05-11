function padZeroes (val, digits=2) {
    let maxnum = 9
    for (var i=1; i < digits; i++) {
        val = (val > maxnum) ? val : '0' + val
        maxnum = parseInt(String(maxnum) + '9')
    }
    return val
}
function sanitizeTimeValue  (i, digits=undefined) {
    return padZeroes(Math.abs(Math.floor(i)), digits)
}

(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
  
    let targetDate = document.querySelector('#countDownTimer').dataset.target,
        keepCounting = document.querySelector('#countDownTimer').dataset.keepcounting
    
    const countDown = new Date(targetDate).getTime(),
        x = setInterval(() => {
  
        const now = new Date().getTime(),
            distance = countDown - now;
  
        document.querySelector('#countDownTimer b.days').innerText = sanitizeTimeValue(distance / day)
        document.querySelector('#countDownTimer b.hours').innerText = sanitizeTimeValue((distance % day) / hour)
        document.querySelector('#countDownTimer b.minutes').innerText = sanitizeTimeValue((distance % hour) / minute)
        document.querySelector('#countDownTimer b.seconds').innerText = sanitizeTimeValue((distance % minute) / second)
  
        //do something later when date is reached
        if (distance < 0 && !keepCounting) {
            document.querySelector('#countDownTimer').classList.add('finished')
            clearInterval(x)
        }
        //seconds
    }, 1000)
}())