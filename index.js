function playVideo(){
  const video = document.getElementById("myVideo");
  if(!video) return;

  video.paused ? video.play() : video.pause();
}

// COUNTER FIX (smooth + stable)
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const target = +counter.dataset.target;
  let count = 0;

  const step = Math.ceil(target / 120);

  function update(){
    count += step;

    if(count < target){
      counter.textContent = count;
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  update();
});
