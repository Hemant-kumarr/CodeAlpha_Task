const figures = document.querySelectorAll('figure');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const closeBtn = document.getElementById('close');
const filterButtons = document.querySelectorAll('.filters button');

let currentIndex = 0;

figures.forEach((fig, index) => {
  fig.addEventListener('click', () => {
    currentIndex = index;
    showLightbox();
  });
});

function showLightbox() {
  const imgSrc = figures[currentIndex].querySelector('img').src;
  lightboxImg.src = imgSrc;
  lightbox.style.display = 'flex';
}

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + figures.length) % figures.length;
  showLightbox();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % figures.length;
  showLightbox();
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    figures.forEach(fig => {
      fig.style.display = filter === 'all' || fig.dataset.category === filter ? 'block' : 'none';
    });
  });
});