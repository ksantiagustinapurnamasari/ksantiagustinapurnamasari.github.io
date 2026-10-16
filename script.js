const menu = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
function closeMenu() {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Buka menu');
}
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

document.addEventListener('click', event => {
  if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
document.addEventListener('focusin', event => {
  if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
});
window.matchMedia('(max-width:900px)').addEventListener('change', closeMenu);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    menu.focus();
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

// Keep bookmarks from the original single-page website working.
const legacyPages = new Map([
  ['#profil', 'profil.html'],
  ['#tentang', 'tentang.html'],
  ['#pendidikan', 'pendidikan.html'],
  ['#kontak', 'kontak.html'],
]);
function redirectLegacyLink() {
  const isHome = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');
  const destination = legacyPages.get(window.location.hash);
  if (isHome && destination) {
    const url = new URL(destination, window.location.href);
    url.search = window.location.search;
    window.location.replace(url.href);
  }
}
redirectLegacyLink();
window.addEventListener('hashchange', redirectLegacyLink);
