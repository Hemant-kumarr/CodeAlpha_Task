const figures = document.querySelectorAll('figure');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const closeBtn = document.getElementById('close');
const filterButtons = document.querySelectorAll('.filters button');
const themeToggle = document.getElementById('theme-toggle');

let currentIndex = 0;

function showLightbox(index) {
  currentIndex = index;
  const img = figures[currentIndex].querySelector('img');
  const caption = figures[currentIndex].querySelector('figcaption').innerText;
  lightboxImg.src = img.src;
  lightboxCaption.textContent = caption;
  lightbox.style.display = 'flex';
}

figures.forEach((fig, i) => {
  fig.addEventListener('click', () => showLightbox(i));
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + figures.length) % figures.length;
  showLightbox(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % figures.length;
  showLightbox(currentIndex);
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    figures.forEach(fig => {
      fig.style.display = filter === 'all' || fig.dataset.category === filter ? 'block' : 'none';
    });
  });
});

// Dark mode toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ESC key to close lightbox
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    lightbox.style.display = 'none';
  } else if (e.key === 'ArrowRight') {
    nextBtn.click();
  } else if (e.key === 'ArrowLeft') {
    prevBtn.click();
  }
});
