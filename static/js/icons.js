document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.icon-button').forEach(btn => {
    const img = btn.querySelector('img');
    if (!img) return;

    const original = img.src;
    const hover = img.dataset.hover;

    if (hover) {
      btn.addEventListener('mouseenter', () => img.src = hover);
      btn.addEventListener('mouseleave', () => img.src = original);
    }
  });
});
