<script>
  const stack = document.getElementById('stack');
  const counter = document.getElementById('counter');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.classList.remove('zoomed');
  void lightboxImg.offsetWidth; // триггер рендеринга
  lightboxImg.classList.add('zoomed');
  const lightboxClose = document.getElementById('lightboxClose');

  let cards = Array.from(stack.querySelectorAll('.card'));
  const total = cards.length;

  function applyStackStyles() {
    cards.forEach((card, i) => {
      card.style.zIndex = '';
      card.style.transform = '';
      card.style.opacity = '';
      card.style.boxShadow = '';

      const depth = i; // 0 = front
      card.style.zIndex = total - depth;

      if (depth === 0) {
        card.style.transform = 'translateY(0px) rotate(0deg) scale(1)';
        card.style.opacity = '1';
        card.style.boxShadow = '0 12px 40px rgba(74,12,12,0.35)';
      } else {
        const yShift = depth * 6;
        const rot = depth % 2 === 0 ? depth * 0.8 : -(depth * 0.7);
        const sc = 1 - depth * 0.03;
        const op = Math.max(0.15, 1 - depth * 0.18);
        card.style.transform = `translateY(${yShift}px) rotate(${rot}deg) scale(${sc})`;
        card.style.opacity = op;
        card.style.boxShadow = '0 4px 15px rgba(74,12,12,0.15)';
      }
    });

    // Current index = position of original first card in DOM order
    // We track order via `cards` array
    counter.textContent = `1 / ${total}`;
    // Actually show which is front:
    updateCounter();
  }

  let currentIndex = 0; // which original index is on top

  function updateCounter() {
    counter.textContent = `${currentIndex + 1} / ${total}`;
  }

  // Send top card to back
  function sendToBack() {
    const front = cards[0];
    front.classList.add('fly-back');

    setTimeout(() => {
      front.classList.remove('fly-back');
      // Move to end of array
      cards.push(cards.shift());
      // Move in DOM
      stack.appendChild(front);
      applyStackStyles();
      currentIndex = (currentIndex + 1) % total;
      updateCounter();
    }, 420);
  }

  // Bring last card to front
  function bringToFront() {
    const last = cards[cards.length - 1];
    // Move in DOM to front
    stack.insertBefore(last, stack.firstChild);
    cards.unshift(cards.pop());
    applyStackStyles();
    currentIndex = (currentIndex - 1 + total) % total;
    updateCounter();
  }

  document.getElementById('btnNext').addEventListener('click', sendToBack);
  document.getElementById('btnPrev').addEventListener('click', bringToFront);

  // Click on top card → lightbox
  stack.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    // Only react if it's the front card
    if (card !== cards[0]) return;
    const src = card.getAttribute('data-src');
    lightboxImg.src = src;
    lightbox.classList.add('open');
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target === lightboxImg) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowRight') sendToBack();
    if (e.key === 'ArrowLeft') bringToFront();
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightboxImg.src = '';
  }

  // Init
  applyStackStyles();
</script>
