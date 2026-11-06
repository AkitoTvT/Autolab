const menu = document.querySelector('.menu-toggle'),
  nav = document.querySelector('header nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('open', open);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav?.classList.contains('open')) {
    nav.classList.remove('open');
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    menu.focus();
  }
});
const form = document.getElementById('inquiry-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const interest = params.get('vehicle') || params.get('service');
  if (interest && [...form.elements.interest.options].some((o) => o.value === interest))
    form.elements.interest.value = interest;
  if (params.get('type') === 'service') form.elements.type.value = 'service';
  if (params.get('vehicle')) form.elements.type.value = 'vehicle';
  const date = new Date();
  const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  form.elements.date.min = localDate;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const result = document.getElementById('form-result');
    result.replaceChildren();
    const title = document.createElement('h3');
    title.textContent = 'Demo complete — nothing was sent.';
    const body = document.createElement('p');
    const selected = form.elements.interest.selectedOptions[0]?.textContent;
    body.textContent = `Thanks, ${form.elements.name.value.trim()}. This is a preview of ${selected && form.elements.interest.value ? `your interest in ${selected}` : 'a general inquiry'}. A real business would connect this form to its inquiry system. No appointment has been created.`;
    result.append(title, body);
    result.hidden = false;
    result.focus();
  });
}

// Add a gentle entrance as sections enter the viewport. All content stays visible
// when animations are disabled or the observer API is not available.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.07 },
  );
  document
    .querySelectorAll('.section-heading, .care-content, .steps > div, .about-grid, .cta')
    .forEach((element) => {
      element.classList.add('reveal-section');
      observer.observe(element);
    });
}
