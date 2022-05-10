(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;
  
    let targetDate = document.querySelector("#countDownTimer").dataset.target
    
    const countDown = new Date(targetDate).getTime(),
        x = setInterval(function() {
  
          const now = new Date().getTime(),
                distance = countDown - now;
  
          document.querySelector("#countDownTimer b.days").innerText = Math.abs(Math.floor(distance / (day))),
            document.querySelector("#countDownTimer b.hours").innerText = Math.abs(Math.floor((distance % (day)) / (hour))),
            document.querySelector("#countDownTimer b.minutes").innerText = Math.abs(Math.floor((distance % (hour)) / (minute))),
            document.querySelector("#countDownTimer b.seconds").innerText = Math.abs(Math.floor((distance % (minute)) / second));
  
          //do something later when date is reached
          /*
          if (distance < 0) {
            // undefined
            clearInterval(x);
          }
          */
          //seconds
        }, 1000)
    }());