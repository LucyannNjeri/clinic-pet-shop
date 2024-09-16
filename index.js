function playVideo() {
  var video = document.getElementById("myVideo");
  if (video.paused) {
      video.play();
  } else {
      video.pause();
  }
}




document.addEventListener('DOMContentLoaded', function() {
  const stats = document.querySelectorAll('.stat-item');

  function countUp(element, endValue, suffix) {
      let startValue = 0;
      const duration = 1000; // Duration to count up in milliseconds
      const pauseDuration = 2000; // Duration to pause after counting up
      const stepTime = 10; // Time interval between increments
      const increment = Math.ceil(endValue / (duration / stepTime));

      function updateCounter() {
          startValue += increment;
          if (startValue >= endValue) {
              startValue = endValue; // Cap at end value
              clearInterval(counterInterval);
              setTimeout(() => {
                  startValue = 0; // Reset count
                  element.textContent = `${startValue}${suffix}`;
                  counterInterval = setInterval(updateCounter, stepTime);
              }, pauseDuration);
          }
          element.textContent = `${startValue}${suffix}`;
      }

      let counterInterval = setInterval(updateCounter, stepTime);
  }

  stats.forEach(stat => {
      const endValue = parseInt(stat.getAttribute('data-count'));
      const suffix = stat.getAttribute('data-suffix');
      countUp(stat.querySelector('h3'), endValue, suffix);
  });
});
//   Counter

function animateCounter(element) {
    const target = +element.getAttribute('data-target');
    let count = 0;
    const increment = target / 200; 

    const updateCounter = () => {
      count += increment;
      if (count < target) {
        element.textContent = Math.ceil(count);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target; 
      }
    };
    updateCounter();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => animateCounter(counter));
  });