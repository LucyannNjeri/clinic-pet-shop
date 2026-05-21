function playVideo(){
  const video = document.getElementById("myVideo");
  video.paused ? video.play() : video.pause();
}

// FIXED COUNTER (smooth, no lag)
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const target = +counter.dataset.target;
  let count = 0;
  const speed = Math.ceil(target / 120);

  function update(){
    count += speed;

    if(count < target){
      counter.textContent = count;
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  update();
});

// AOS OPTIMIZED
AOS.init({
  once:true,
  duration:800
});
