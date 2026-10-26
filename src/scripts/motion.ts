import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

type GalleryPhoto = { src: string; alt: string; title: string; note: string; width: number; height: number };

function initHotel() {
  const events = new AbortController();
  const { signal } = events;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopPointer = window.matchMedia('(min-width: 800px) and (pointer: fine)');
  const header = document.querySelector<HTMLElement>('[data-header]');
  const hero = document.querySelector<HTMLElement>('.hero');
  const reservation = document.querySelector<HTMLElement>('#reservation');
  const floating = document.querySelector<HTMLElement>('[data-floating-actions]');
  const menu = document.querySelector<HTMLDialogElement>('#site-menu');
  const menuOpen = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const viewer = document.querySelector<HTMLDialogElement>('#photo-viewer');
  let lenis: Lenis | undefined;
  let heroPassed = false;
  let reservationVisible = false;
  let returnFocus: HTMLElement | null = null;

  const onLenisScroll = () => ScrollTrigger.update();
  const tick = (time: number) => lenis?.raf(time * 1000);

  function syncDialogLock() {
    const open = Boolean(document.querySelector('dialog[open]'));
    document.body.classList.toggle('has-dialog', open);
    if (open) lenis?.stop();
    else lenis?.start();
  }

  function configureScroll() {
    if (lenis) {
      gsap.ticker.remove(tick);
      lenis.off('scroll', onLenisScroll);
      lenis.destroy();
      lenis = undefined;
    }
    if (!reducedMotion.matches && desktopPointer.matches) {
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false, autoRaf: false, anchors: false });
      lenis.on('scroll', onLenisScroll);
      gsap.ticker.add(tick);
      syncDialogLock();
    }
  }

  configureScroll();
  gsap.ticker.lagSmoothing(0);
  reducedMotion.addEventListener('change', configureScroll, { signal });
  desktopPointer.addEventListener('change', configureScroll, { signal });

  function syncFloatingActions() {
    const visible = heroPassed && !reservationVisible;
    if (!floating) return;
    floating.classList.toggle('is-visible', visible);
    floating.inert = !visible;
    floating.setAttribute('aria-hidden', String(!visible));
  }

  // Native observers keep basic navigation independent from animation preferences.
  const heroObserver = new IntersectionObserver(([entry]) => {
    heroPassed = !entry.isIntersecting && entry.boundingClientRect.bottom <= 0;
    syncFloatingActions();
  }, { threshold: 0 });
  if (hero) heroObserver.observe(hero);

  const reservationObserver = new IntersectionObserver(([entry]) => {
    reservationVisible = entry.isIntersecting;
    syncFloatingActions();
  }, { threshold: 0 });
  if (reservation) reservationObserver.observe(reservation);

  let headerQueued = false;
  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 64);
    headerQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!headerQueued) { headerQueued = true; requestAnimationFrame(updateHeader); }
  }, { passive: true, signal });
  updateHeader();

  if (menu && menuOpen) {
    menuOpen.hidden = false;
    menuOpen.addEventListener('click', () => {
      if (menu.open) return;
      menu.showModal();
      menuOpen.setAttribute('aria-expanded', 'true');
      syncDialogLock();
      if (!reducedMotion.matches) {
        gsap.fromTo(menu.querySelectorAll('.menu-links li'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: .4, stagger: .055, clearProps: 'all', overwrite: true });
      }
    }, { signal });
    menu.querySelector('[data-menu-close]')?.addEventListener('click', () => menu.close(), { signal });
    menu.addEventListener('close', () => {
      menuOpen.setAttribute('aria-expanded', 'false');
      gsap.killTweensOf(menu.querySelectorAll('.menu-links li'));
      gsap.set(menu.querySelectorAll('.menu-links li'), { clearProps: 'all' });
      syncDialogLock();
    }, { signal });
  }

  function focusSection(target: HTMLElement) {
    const hadTabIndex = target.hasAttribute('tabindex');
    if (!hadTabIndex) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
  }

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      if (menu?.open) menu.close();
      // The close event is queued; release the scroll lock before moving.
      syncDialogLock();
      if (window.location.hash !== hash) window.history.pushState(null, '', hash);
      const offset = hash === '#top' ? 0 : (header?.offsetHeight ?? 80) + 16;
      focusSection(target);
      if (lenis) lenis.scrollTo(target, { offset: -offset, duration: 1.1 });
      else window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    }, { signal });
  });

  const galleryElement = document.querySelector('#gallery-data');
  let gallery: GalleryPhoto[] = [];
  try { gallery = JSON.parse(galleryElement?.textContent ?? '[]'); }
  catch { /* Keep the page and ordinary navigation usable if photo data is missing. */ }
  let currentPhoto = 0;
  const image = viewer?.querySelector<HTMLImageElement>('[data-photo-image]');
  const photoTitle = viewer?.querySelector<HTMLElement>('[data-photo-title]');
  const photoNote = viewer?.querySelector<HTMLElement>('[data-photo-note]');
  const counter = viewer?.querySelector<HTMLElement>('[data-photo-counter]');

  function showPhoto(index: number) {
    if (!image || !gallery.length) return;
    currentPhoto = (index + gallery.length) % gallery.length;
    const photo = gallery[currentPhoto];
    image.src = photo.src;
    image.alt = photo.alt;
    image.width = photo.width;
    image.height = photo.height;
    if (photoTitle) photoTitle.textContent = photo.title;
    if (photoNote) photoNote.textContent = photo.note;
    if (counter) counter.textContent = String(currentPhoto + 1).padStart(2, '0');
    // Preload only the adjacent photo once a visitor begins exploring.
    const next = new window.Image();
    next.src = gallery[(currentPhoto + 1) % gallery.length].src;
  }

  if (viewer && image && gallery.length) {
    document.querySelectorAll<HTMLButtonElement>('[data-photo-index]').forEach(button => {
      button.addEventListener('click', () => {
        returnFocus = button;
        showPhoto(Number(button.dataset.photoIndex ?? 0));
        if (!viewer.open) viewer.showModal();
        syncDialogLock();
      }, { signal });
    });
    viewer.querySelector('[data-photo-close]')?.addEventListener('click', () => viewer.close(), { signal });
    viewer.querySelector('[data-photo-prev]')?.addEventListener('click', () => showPhoto(currentPhoto - 1), { signal });
    viewer.querySelector('[data-photo-next]')?.addEventListener('click', () => showPhoto(currentPhoto + 1), { signal });
    viewer.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(currentPhoto - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(currentPhoto + 1); }
    }, { signal });
    viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); }, { signal });
    const stage = viewer.querySelector<HTMLElement>('[data-photo-stage]');
    stage?.addEventListener('click', event => { if (event.target === stage) viewer.close(); }, { signal });
    let touchStartX = 0;
    let touchStartY = 0;
    stage?.addEventListener('touchstart', event => {
      touchStartX = event.changedTouches[0].clientX;
      touchStartY = event.changedTouches[0].clientY;
    }, { passive: true, signal });
    stage?.addEventListener('touchend', event => {
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) showPhoto(currentPhoto + (dx < 0 ? 1 : -1));
    }, { passive: true, signal });
    viewer.addEventListener('close', () => {
      syncDialogLock();
      returnFocus?.focus({ preventScroll: true });
    }, { signal });
  }

  const animations = gsap.matchMedia();
  animations.add('(prefers-reduced-motion: no-preference)', () => {
    // CSS never hides content. These effects are progressively applied by JS.
    const heroImage = document.querySelector('.hero__image');
    if (heroImage && window.scrollY < (hero?.offsetHeight ?? 0)) {
      gsap.fromTo(heroImage, { scale: 1.04 }, { scale: 1, duration: 1.7, ease: 'power2.out', clearProps: 'transform' });
      gsap.from('.hero__copy > span', { y: 18, autoAlpha: 0, duration: .9, delay: .15, stagger: .12, ease: 'power2.out', clearProps: 'all' });
    }
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
      gsap.from(element, {
        y: 22, autoAlpha: 0, duration: .85, ease: 'power2.out', clearProps: 'all',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true },
      });
    });
  });
  animations.add('(min-width: 800px) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLImageElement>('[data-parallax-image]').forEach(photo => {
      gsap.fromTo(photo, { y: 0 }, { y: -30, ease: 'none', scrollTrigger: { trigger: photo.closest('.photo-frame') ?? photo, start: 'top bottom', end: 'bottom top', scrub: .8 } });
    });
  });

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') refresh();
  else window.addEventListener('load', refresh, { once: true, signal });
  document.fonts?.ready.then(() => { if (!signal.aborted) refresh(); });

  return () => {
    events.abort();
    heroObserver.disconnect();
    reservationObserver.disconnect();
    animations.revert();
    gsap.ticker.remove(tick);
    lenis?.destroy();
    document.body.classList.remove('has-dialog');
  };
}

const dispose = initHotel();
window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); }, { once: true });
if (import.meta.hot) import.meta.hot.dispose(dispose);
