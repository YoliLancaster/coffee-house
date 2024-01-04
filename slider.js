document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.getElementById('slider');
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const progressBarItems = document.querySelectorAll('.choice__progress-item .choice__progress-line');

  let currentIndex = 0;
  const intervalDuration = 5000;
  let intervalId;
  let touchStartX = 0;
  let touchEndX = 0;
  let isSwiping = false;
  let lastSwipeTime = 0;
  let timeSinceLastSwipe = 0;
  let autoplayEnabled = true;

  function showImage(index) {
      const translateValue = -index * 100 + '%';
      carousel.style.transition = 'transform 0.5s ease-in-out';
      carousel.style.transform = 'translateX(' + translateValue + ')';
      updateProgressBar(index);
      startProgressBarAnimation();
  }

  function nextImage() {
      currentIndex = (currentIndex + 1) % carousel.childElementCount;
      showImage(currentIndex);
  }

  function prevImage() {
      currentIndex = (currentIndex - 1 + carousel.childElementCount) % carousel.childElementCount;
      showImage(currentIndex);
  }

  function startCarousel() {
      if (!carousel.getAttribute('data-carousel-initialized')) {
          // add animation for the first progress bar
          progressBarItems[0].style.transition = 'width 5s linear';
          progressBarItems[0].style.width = '100%';
          carousel.setAttribute('data-carousel-initialized', 'true');
      }

      if (autoplayEnabled) {
          intervalId = setInterval(() => {
              if (!isSwiping) {
                  nextImage();
              }
              timeSinceLastSwipe += intervalDuration;
              if (timeSinceLastSwipe >= intervalDuration) {
                  timeSinceLastSwipe = 0;
              }
          }, intervalDuration);
      }
  }

  function stopCarousel() {
      clearInterval(intervalId);
      lastSwipeTime = Date.now();
      timeSinceLastSwipe = 0;
  }

  function handleTouchStart(event) {
      touchStartX = event.touches[0].clientX;
      isSwiping = true;
      lastSwipeTime = Date.now();
  }

  function handleTouchMove(event) {
      if (!isSwiping) return;

      touchEndX = event.touches[0].clientX;

      const swipeDistance = touchStartX - touchEndX;

      // block page scrolling only if the swipe inside the slider
      if (Math.abs(swipeDistance) > 10) {
          event.preventDefault();
      }
  }

  function handleTouchEnd() {
      if (!isSwiping) return;

      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > 50) {
          if (swipeDistance > 0) {
              nextImage();
          } else {
              prevImage();
          }
      }

      isSwiping = false;

      // stop the carousel and reset the interval
      stopCarousel();
      startCarousel();
  }

  function updateProgressBar(index) {
      progressBarItems.forEach((item, i) => {
          if (i === index) {
              item.style.width = '100%';
          } else {
              item.style.width = '0';
          }
      });
  }

  function startProgressBarAnimation() {
      progressBarItems.forEach((item, i) => {
          item.style.transition = 'width 0s';
          item.style.width = '0';
      });

      // launch animation for the current progress bar
      progressBarItems[currentIndex].style.transition = 'width 5s linear';
      progressBarItems[currentIndex].style.width = '100%';
  }

  nextBtn.addEventListener('click', function () {
      nextImage();
      stopCarousel();
      startCarousel();
  });

  prevBtn.addEventListener('click', function () {
      prevImage();
      stopCarousel();
      startCarousel();
  });

  let pauseStartTime = 0;

  carousel.addEventListener('mouseenter', function () {
      stopCarousel();
      pauseStartTime = Date.now(); // remember the start time of the pause
      const progressBar = progressBarItems[currentIndex];
      const computedStyle = getComputedStyle(progressBar);
      const width = computedStyle.getPropertyValue('width');
      progressBar.style.transition = 'none';
      progressBar.style.width = width;
  });

  let isPausedDuringHover = false;

  carousel.addEventListener('mouseenter', function () {
      stopCarousel();
      isPausedDuringHover = true;
  });

  carousel.addEventListener('mouseleave', function () {
      startCarousel();
      const progressBar = progressBarItems[currentIndex];

      // if the slider was stopped while hovering, adjust the animation time
      const remainingTime = isPausedDuringHover ? intervalDuration : intervalDuration - (Date.now() - pauseStartTime);

      progressBar.style.transition = `width ${remainingTime / 1000}s linear`;
      progressBar.style.width = '100%';

      // remove the animation after completion
      setTimeout(() => {
          progressBar.style.transition = '';
      }, remainingTime);

      isPausedDuringHover = false;
  });

  carousel.addEventListener('touchstart', handleTouchStart);
  carousel.addEventListener('touchmove', handleTouchMove);
  carousel.addEventListener('touchend', handleTouchEnd);

  startCarousel();
});