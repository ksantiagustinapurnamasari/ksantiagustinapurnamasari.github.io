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

const gallery = document.querySelector('.gallery');
if (gallery) {
  const items = [...gallery.querySelectorAll('.gallery-item')];
  const filters = [...gallery.querySelectorAll('[data-filter]')];
  const status = gallery.querySelector('.gallery-status');
  const updateGallery = filter => {
    let visible = 0;
    items.forEach(item => {
      const show = filter === 'semua' || item.dataset.category === filter;
      item.hidden = !show;
      if (show) visible += 1;
    });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
    if (status) status.textContent = `Menampilkan ${visible} karya`;
  };
  filters.forEach(button => button.addEventListener('click', () => updateGallery(button.dataset.filter)));
  updateGallery('semua');

  const dialog = document.querySelector('.gallery-dialog');
  const opens = [...gallery.querySelectorAll('.gallery-open')];
  if (dialog && typeof dialog.showModal === 'function' && opens.length) {
    const dialogTitle = dialog.querySelector('#gallery-dialog-title');
    const dialogImage = dialog.querySelector('.gallery-dialog-image');
    const dialogDescription = dialog.querySelector('#gallery-dialog-description');
    const position = dialog.querySelector('.gallery-position');
    const close = dialog.querySelector('.gallery-close');
    const previous = dialog.querySelector('.gallery-prev');
    const next = dialog.querySelector('.gallery-next');
    let current = 0;
    let returnFocus = null;
    const renderDialog = index => {
      current = (index + opens.length) % opens.length;
      const link = opens[current];
      const image = link.querySelector('img');
      const title = link.closest('figure').querySelector('h2')?.textContent || image.alt;
      dialogTitle.textContent = title;
      dialogImage.src = link.href;
      dialogImage.alt = image.alt;
      dialogDescription.textContent = link.closest('figure').querySelector('p')?.textContent || image.alt;
      position.textContent = `${current + 1} dari ${opens.length}`;
      previous.disabled = opens.length < 2;
      next.disabled = opens.length < 2;
    };
    opens.forEach((link, index) => link.addEventListener('click', event => {
      event.preventDefault();
      returnFocus = link;
      renderDialog(index);
      dialog.showModal();
      close.focus();
    }));
    close.addEventListener('click', () => dialog.close());
    previous.addEventListener('click', () => renderDialog(current - 1));
    next.addEventListener('click', () => renderDialog(current + 1));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => { if (returnFocus) returnFocus.focus(); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') renderDialog(current - 1);
      if (event.key === 'ArrowRight') renderDialog(current + 1);
    });
  }
}

// Keep bookmarks from the original single-page website working.
const legacyPages = new Map([
  ['#profil', 'profil.html'],
  ['#tentang', 'tentang.html'],
  ['#pendidikan', 'pendidikan.html'],
  ['#kontak', 'kontak.html'],
  ['#galeri', 'galeri.html'],
  ['#gallery', 'galeri.html'],
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
