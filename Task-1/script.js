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
let visibleFigures = Array.from(figures);

// Add staggered animation to figures on load
figures.forEach((fig, i) => {
  fig.style.animationDelay = `${i * 0.1}s`;
});

function showLightbox(index) {
  currentIndex = index;
  const img = visibleFigures[currentIndex].querySelector('img');
  const caption = visibleFigures[currentIndex].querySelector('figcaption').innerText;
  
  lightboxImg.style.opacity = '0';
  lightboxImg.style.transform = 'scale(0.8)';
  
  setTimeout(() => {
    lightboxImg.src = img.src;
    lightboxCaption.textContent = caption;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
      lightboxImg.style.opacity = '1';
      lightboxImg.style.transform = 'scale(1)';
    }, 50);
  }, 100);
}

figures.forEach((fig, i) => {
  fig.addEventListener('click', () => {
    const visibleIndex = visibleFigures.indexOf(fig);
    if (visibleIndex !== -1) {
      showLightbox(visibleIndex);
    }
  });
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + visibleFigures.length) % visibleFigures.length;
  showLightbox(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % visibleFigures.length;
  showLightbox(currentIndex);
});

function closeLightbox() {
  lightboxImg.style.opacity = '0';
  lightboxImg.style.transform = 'scale(0.8)';
  
  setTimeout(() => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }, 200);
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    
    // Animate out hidden figures
    figures.forEach((fig, i) => {
      const shouldShow = filter === 'all' || fig.dataset.category === filter;
      
      if (!shouldShow) {
        fig.style.opacity = '0';
        fig.style.transform = 'translateY(20px) scale(0.95)';
        setTimeout(() => {
          fig.style.display = 'none';
        }, 300);
      }
    });
    
    // Update visible figures array
    setTimeout(() => {
      visibleFigures = Array.from(figures).filter(fig => 
        filter === 'all' || fig.dataset.category === filter
      );
      
      // Animate in visible figures
      visibleFigures.forEach((fig, i) => {
        fig.style.display = 'block';
        setTimeout(() => {
          fig.style.opacity = '1';
          fig.style.transform = 'translateY(0) scale(1)';
        }, i * 100);
      });
    }, 300);
  });
});

// Dark mode toggle with smooth transition
themeToggle.addEventListener('click', () => {
  document.body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
  
  setTimeout(() => {
    document.body.style.transition = '';
  }, 500);
});

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    } else if (e.key === 'ArrowLeft') {
      prevBtn.click();
    }
  }
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});

// Initialize
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-in-out';

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
