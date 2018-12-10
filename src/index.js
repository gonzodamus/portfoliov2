document.addEventListener("DOMContentLoaded", () =>{
  const first = document.getElementById("FirstQuote")
  const second = document.getElementById("SecondQuote")
  const third = document.getElementById("ThirdQuote")
  first.style.opacity = 1

  setInterval( () =>{
    if(first.style.opacity == 1){
      first.style.opacity = 0
      second.style.opacity = 1
      third.style.opacity = 0
    } else if (second.style.opacity == 1){
      first.style.opacity = 0
      second.style.opacity = 0
      third.style.opacity = 1
    } else {
      first.style.opacity = 1
      second.style.opacity = 0
      third.style.opacity = 0
    }
  }, 6000)


})
