// app.js - High Score PTE Academic

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScoreConverter();
  initPracticeHub();
  initReviewsCarousel();
  initVideoPlayers();
  initMultistepForm();
  initScrollReveal();
  initHeroSlideshow();
});

// 1. Sticky Header
function initHeader() {
  const header = document.getElementById('header');
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
}

// 2. Score Slider Converter
function initScoreConverter() {
  const slider = document.getElementById('pte-range-slider');
  const sliderVal = document.getElementById('pte-slider-val');
  const pteBox = document.getElementById('pte-score-box');
  const ieltsBox = document.getElementById('ielts-score-box');
  const toeflBox = document.getElementById('toefl-score-box');

  if (!slider) return;

  function updateScores(val) {
    sliderVal.textContent = val;
    pteBox.textContent = val;

    let ielts = '4.0';
    let toefl = '30';

    const pte = parseInt(val);

    if (pte >= 10 && pte < 30) {
      ielts = '4.5';
      toefl = '32';
    } else if (pte >= 30 && pte < 43) {
      ielts = '5.0';
      toefl = '40';
    } else if (pte >= 43 && pte < 51) {
      ielts = '5.5';
      toefl = '52';
    } else if (pte >= 51 && pte < 59) {
      ielts = '6.0';
      toefl = '70';
    } else if (pte >= 59 && pte < 65) {
      ielts = '6.5';
      toefl = '86';
    } else if (pte >= 65 && pte < 73) {
      ielts = '7.0';
      toefl = '95';
    } else if (pte >= 73 && pte < 79) {
      ielts = '7.5';
      toefl = '105';
    } else if (pte >= 79 && pte < 86) {
      ielts = '8.0';
      toefl = '112';
    } else if (pte >= 86) {
      ielts = '9.0';
      toefl = '118';
    }

    ieltsBox.textContent = ielts;
    toeflBox.textContent = toefl;
  }

  slider.addEventListener('input', (e) => {
    updateScores(e.target.value);
  });

  // Init default values
  updateScores(slider.value);
}

// 3. Practice Hub Tab & Module Logics
function initPracticeHub() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.practice-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Set active panel
      const targetPanelId = `panel-${tab.dataset.tab}`;
      panels.forEach(p => {
        if (p.id === targetPanelId) {
          p.classList.add('active');
        } else {
          p.classList.remove('active');
        }
      });
    });
  });

  // Modules Specific Logic
  initSpeakingModule();
  initWritingModule();
  initReadingModule();
  initListeningModule();
}

// Speaking Module logic
function initSpeakingModule() {
  const recordBtn = document.getElementById('record-speaking-btn');
  const statusText = document.getElementById('speaking-status-text');
  const wave = document.getElementById('speaking-wave');
  const feedbackBox = document.getElementById('speaking-feedback');
  const scoreVal = document.getElementById('speaking-score');

  if (!recordBtn) return;

  let isRecording = false;
  let recordingTimeout = null;

  recordBtn.addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  function startRecording() {
    isRecording = true;
    recordBtn.classList.add('recording');
    wave.classList.add('active');
    feedbackBox.classList.remove('active');
    
    let countdown = 3;
    statusText.textContent = `Get ready... ${countdown}s`;

    const timer = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        statusText.textContent = `Get ready... ${countdown}s`;
      } else {
        clearInterval(timer);
        statusText.textContent = "Recording... Speak Now!";
        statusText.classList.add('active');
        
        // Auto stop after 7 seconds
        recordingTimeout = setTimeout(() => {
          stopRecording();
        }, 7000);
      }
    }, 1000);
  }

  function stopRecording() {
    if (!isRecording) return;
    isRecording = false;
    clearTimeout(recordingTimeout);
    
    recordBtn.classList.remove('recording');
    wave.classList.remove('active');
    statusText.classList.remove('active');
    statusText.textContent = "Processing speech diagnostics...";

    setTimeout(() => {
      statusText.textContent = "Diagnostic analysis completed!";
      scoreVal.textContent = Math.floor(Math.random() * (88 - 72 + 1)) + 72; // Mock score 72-88
      feedbackBox.classList.add('active');
    }, 2000);
  }
}

// Writing Module logic
function initWritingModule() {
  const textarea = document.getElementById('essay-input-box');
  const wordCount = document.getElementById('essay-word-val');
  const timerText = document.getElementById('essay-timer');
  const submitBtn = document.getElementById('submit-essay-btn');
  const feedbackBox = document.getElementById('writing-feedback');
  const scoreVal = document.getElementById('writing-score');

  if (!textarea) return;

  let hasStartedTimer = false;
  let timeRemaining = 1200; // 20 minutes in seconds
  let timerInterval = null;

  textarea.addEventListener('input', (e) => {
    const text = e.target.value.trim();
    const words = text === '' ? 0 : text.split(/\s+/).length;
    wordCount.textContent = words;

    if (!hasStartedTimer && words > 0) {
      startTimer();
    }
  });

  function startTimer() {
    hasStartedTimer = true;
    timerInterval = setInterval(() => {
      timeRemaining--;
      if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        timerText.textContent = "00:00";
        textarea.disabled = true;
        evaluateEssay();
      } else {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerText.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
  }

  submitBtn.addEventListener('click', () => {
    evaluateEssay();
  });

  function evaluateEssay() {
    const text = textarea.value.trim();
    const words = text === '' ? 0 : text.split(/\s+/).length;

    if (words < 10) {
      alert("Please write a response before submitting.");
      return;
    }

    clearInterval(timerInterval);
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Grading Essay...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Evaluate Essay';
      
      let baseScore = 65;
      if (words >= 200 && words <= 300) {
        baseScore += Math.floor(Math.random() * 15) + 8; // bonus for ideal length
      } else if (words < 120) {
        baseScore -= 15;
      }
      
      scoreVal.textContent = Math.min(90, Math.max(10, baseScore));
      feedbackBox.classList.add('active');
    }, 2000);
  }
}

// Reading Module logic
function initReadingModule() {
  const select1 = document.getElementById('reading-blank-1');
  const select2 = document.getElementById('reading-blank-2');
  const select3 = document.getElementById('reading-blank-3');
  const submitBtn = document.getElementById('submit-reading-btn');
  const feedbackBox = document.getElementById('reading-feedback');
  const scoreVal = document.getElementById('reading-score');
  const feedbackText = document.getElementById('reading-feedback-text');

  if (!submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const ans1 = select1.value;
    const ans2 = select2.value;
    const ans3 = select3.value;

    if (!ans1 || !ans2 || !ans3) {
      alert("Please choose answers for all blanks before submitting.");
      return;
    }

    let correct = 0;
    if (ans1 === 'environment') correct++;
    if (ans2 === 'essential') correct++;
    if (ans3 === 'systems') correct++;

    let score = 10;
    if (correct === 1) score = 45;
    if (correct === 2) score = 70;
    if (correct === 3) score = 90;

    scoreVal.textContent = score;
    feedbackText.innerHTML = `
      <strong>Verification Result:</strong> ${correct} out of 3 blanks answered correctly.<br>
      • Blank 1: ${ans1 === 'environment' ? '<span style="color:var(--success)">Correct</span>' : '<span style="color:var(--danger)">Incorrect (Correct: environment)</span>'}<br>
      • Blank 2: ${ans2 === 'essential' ? '<span style="color:var(--success)">Correct</span>' : '<span style="color:var(--danger)">Incorrect (Correct: essential)</span>'}<br>
      • Blank 3: ${ans3 === 'systems' ? '<span style="color:var(--success)">Correct</span>' : '<span style="color:var(--danger)">Incorrect (Correct: systems)</span>'}
    `;
    feedbackBox.classList.add('active');
  });
}

// Listening Module logic
function initListeningModule() {
  const playBtn = document.getElementById('play-listening-audio-btn');
  const progressFill = document.getElementById('listening-audio-progress');
  const timeLabel = document.getElementById('listening-audio-time');
  const inputBox = document.getElementById('listening-input-box');
  const submitBtn = document.getElementById('submit-listening-btn');
  const feedbackBox = document.getElementById('listening-feedback');
  const scoreVal = document.getElementById('listening-score');
  const accuracyLabel = document.getElementById('listening-feedback-match');

  if (!playBtn) return;

  const targetSentence = "The lecture will cover several topics in global economics";
  let isPlaying = false;
  let playbackInterval = null;

  playBtn.addEventListener('click', () => {
    if (isPlaying) return;
    playAudioSimulation();
  });

  function playAudioSimulation() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fa-solid fa-volume-high animate-pulse"></i>';
    playBtn.disabled = true;

    // Use Web Speech API if supported for interactive TTS
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(targetSentence);
      utterance.rate = 0.85;
      utterance.onend = () => {
        endPlayback();
      };
      window.speechSynthesis.speak(utterance);
    }

    let progress = 0;
    const duration = 5000; // 5 seconds
    const intervalTime = 100;
    const steps = duration / intervalTime;

    playbackInterval = setInterval(() => {
      progress += (100 / steps);
      progressFill.style.width = `${Math.min(100, progress)}%`;
      
      const sec = Math.floor((progress / 100) * 5);
      timeLabel.textContent = `0:0${sec}`;

      if (progress >= 100) {
        clearInterval(playbackInterval);
        if (!('speechSynthesis' in window)) {
          endPlayback();
        }
      }
    }, intervalTime);
  }

  function endPlayback() {
    isPlaying = false;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playBtn.disabled = false;
  }

  submitBtn.addEventListener('click', () => {
    const inputVal = inputBox.value.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");
    const cleanTarget = targetSentence.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"");

    if (inputVal === '') {
      alert("Please type the sentence you heard before submitting.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking transcript...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-bolt"></i> Verify Sentence';

      const inputWords = inputVal.split(/\s+/);
      const targetWords = cleanTarget.split(/\s+/);

      let matched = 0;
      targetWords.forEach(word => {
        if (inputWords.includes(word)) matched++;
      });

      const accuracy = Math.round((matched / targetWords.length) * 100);
      let score = 10;
      if (accuracy > 30) score = 40;
      if (accuracy > 60) score = 68;
      if (accuracy > 85) score = 88;
      if (accuracy === 100) score = 90;

      scoreVal.textContent = score;
      accuracyLabel.textContent = `Match Accuracy: ${accuracy}%`;
      feedbackBox.classList.add('active');
    }, 1500);
  });
}

// 4. Reviews Carousel (Auto-scroll & Interactive Navigation)
function initReviewsCarousel() {
  const track = document.getElementById('reviews-track');
  const prevBtn = document.getElementById('reviews-prev-btn');
  const nextBtn = document.getElementById('reviews-next-btn');
  const dots = document.querySelectorAll('#reviews-dots .carousel-dot');
  const cards = document.querySelectorAll('#reviews-track .review-card');

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let slideInterval = null;

  function getVisibleCardsCount() {
    return window.innerWidth > 768 ? 2 : 1;
  }

  function getMaxIndex() {
    return cards.length - getVisibleCardsCount();
  }

  function updateCarousel() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }
    if (currentIndex < 0) {
      currentIndex = maxIndex;
    }

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 24; // matches gap in CSS
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  function nextSlide() {
    currentIndex++;
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) {
      currentIndex = 0;
    }
    updateCarousel();
  }

  function prevSlide() {
    currentIndex--;
    const maxIdx = getMaxIndex();
    if (currentIndex < 0) {
      currentIndex = maxIdx;
    }
    updateCarousel();
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, 3500);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      const maxIdx = getMaxIndex();
      currentIndex = Math.min(idx, maxIdx);
      updateCarousel();
      startAutoPlay();
    });
  });

  window.addEventListener('resize', () => {
    updateCarousel();
  });

  updateCarousel();
  startAutoPlay();
}

// 4b. Video Testimonials Player (Premium Play on Click)
function initVideoPlayers() {
  const containers = document.querySelectorAll('.video-container');

  containers.forEach(container => {
    const video = container.querySelector('.testimonial-video');
    const overlay = container.querySelector('.video-overlay');

    if (!video || !overlay) return;

    overlay.addEventListener('click', () => {
      // Pause all other playing videos for premium experience
      document.querySelectorAll('.testimonial-video').forEach(v => {
        if (v !== video) {
          v.pause();
          const parent = v.closest('.video-container');
          if (parent) {
            parent.classList.remove('playing');
            v.removeAttribute('controls');
          }
        }
      });

      // Play selected video
      container.classList.add('playing');
      video.setAttribute('controls', 'true');
      video.play();
    });
  });
}

// 5. Multistep Booking Form
function initMultistepForm() {
  const form = document.getElementById('multistep-booking-form');
  if (!form) return;

  const steps = document.querySelectorAll('.form-step');
  const indicators = document.querySelectorAll('.step-indicator .step-dot');
  const prevBtn = document.getElementById('prev-step-btn');
  const nextBtn = document.getElementById('next-step-btn');
  const submitBtn = document.getElementById('submit-booking-btn');

  let currentStep = 0; // 0-indexed steps

  // Chip Selector logic
  setupChipSelectors('target-score-chips', 'booking-target-score');
  setupChipSelectors('coaching-mode-chips', 'booking-coaching-mode');

  function setupChipSelectors(containerId, hiddenInputId) {
    const container = document.getElementById(containerId);
    const hiddenInput = document.getElementById(hiddenInputId);
    if (!container || !hiddenInput) return;

    const chips = container.querySelectorAll('.chip-btn');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        hiddenInput.value = chip.dataset.val;
      });
    });
  }

  function updateFormStep() {
    steps.forEach((step, idx) => {
      if (idx === currentStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    indicators.forEach((indicator, idx) => {
      const indicatorStep = parseInt(indicator.dataset.step) - 1;
      if (indicatorStep < currentStep) {
        indicator.className = 'step-dot completed';
      } else if (indicatorStep === currentStep) {
        indicator.className = 'step-dot active';
      } else {
        indicator.className = 'step-dot';
      }
    });

    // Navigation buttons toggle
    if (currentStep === 0) {
      prevBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'inline-flex';
    }

    if (currentStep === steps.length - 1) {
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'inline-flex';
    } else {
      nextBtn.style.display = 'inline-flex';
      submitBtn.style.display = 'none';
    }
  }

  nextBtn.addEventListener('click', () => {
    if (validateStep(currentStep)) {
      currentStep++;
      updateFormStep();
    }
  });

  prevBtn.addEventListener('click', () => {
    currentStep--;
    updateFormStep();
  });

  function validateStep(stepIdx) {
    if (stepIdx === 0) {
      const name = document.getElementById('booking-name');
      const phone = document.getElementById('booking-phone');
      if (!name.value.trim() || !phone.value.trim()) {
        alert("Please enter both your name and phone number.");
        return false;
      }
    } else if (stepIdx === 1) {
      // Target score & mode chips have defaults, always valid
      return true;
    } else if (stepIdx === 2) {
      const date = document.getElementById('booking-date');
      if (!date.value) {
        alert("Please select a preferred date.");
        return false;
      }
    }
    return true;
  }

  // Redirect to WhatsApp on Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    const name = document.getElementById('booking-name').value;
    const phone = document.getElementById('booking-phone').value;
    const targetScore = document.getElementById('booking-target-score').value;
    const coachingMode = document.getElementById('booking-coaching-mode').value;
    const date = document.getElementById('booking-date').value;
    const slot = document.getElementById('booking-slot').value;

    const message = `Hello High Score PTE!\n\nI would like to book a Free Diagnostic Test & Consultation.\n\n*Details:*\n• Name: ${name}\n• Phone: ${phone}\n• Target PTE Score: ${targetScore}\n• Coaching Mode: ${coachingMode}\n• Preferred Date: ${date}\n• Time Slot: ${slot}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/918360990936?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  });
}

// 6. Scroll Reveal Animation
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  reveals.forEach(reveal => {
    observer.observe(reveal);
  });
}

// 7. Hero Image Slideshow
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-bg-slider .slide');
  if (slides.length === 0) return;

  let currentIdx = 0;
  setInterval(() => {
    slides[currentIdx].classList.remove('active');
    currentIdx = (currentIdx + 1) % slides.length;
    slides[currentIdx].classList.add('active');
  }, 5000);
}
