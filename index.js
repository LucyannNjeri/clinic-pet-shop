function playVideo(){

  const video = document.getElementById("myVideo");

  if(video.paused){
    video.play();
  }else{
    video.pause();
  }
}

AOS.init({
  duration:1000,
  once:true
});

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

  const target = +counter.dataset.target;

  let count = 0;

  const updateCounter = () => {

    const increment = target / 100;

    count += increment;

    if(count < target){

      counter.innerText = Math.ceil(count);

      requestAnimationFrame(updateCounter);

    }else{

      counter.innerText = target;
    }
  };

  updateCounter();
});
