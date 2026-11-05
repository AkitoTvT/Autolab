/* AutoLab's React interactions. Local libraries keep the template portable. */
(() => {
  'use strict';
  if (!window.React || !window.ReactDOM) return;
  const { createElement: h, useState, useEffect, useRef, useContext, createContext } = React;
  const { createPortal, createRoot } = ReactDOM;
  const config = JSON.parse(document.getElementById('autolab-data').textContent);
  const cars = config.cars;
  const base = config.base;
  const url = path => base + path;
  const image = car => url('assets/' + car.image);
  const modelUrl = car => url('cars/' + car.slug + '/');
  const money = value => '₱' + Number(value).toLocaleString('en-PH');
  const validIds = new Set(cars.map(car => car.slug));
  const storeKey = 'autolab-shortlist-v1';
  const UI = createContext(null);
  const heroTarget = document.getElementById('hero-react');
  const collectionTarget = document.getElementById('collection-react');
  const headerTarget = document.getElementById('header-tools');
  // Static HTML remains a useful fallback if React cannot load.
  const toolsTargets = [...document.querySelectorAll('[data-car-tools]')]
    .filter(node => !collectionTarget?.contains(node));
  heroTarget?.replaceChildren();
  collectionTarget?.replaceChildren();

  function readShortlist() {
    try {
      const data = JSON.parse(localStorage.getItem(storeKey) || '{}');
      return {
        saved: Array.isArray(data.saved) ? [...new Set(data.saved.filter(id => validIds.has(id)))] : [],
        compare: Array.isArray(data.compare) ? [...new Set(data.compare.filter(id => validIds.has(id)))].slice(0, 3) : []
      };
    } catch { return { saved: [], compare: [] }; }
  }

  function CarTools({ car, quick = true }) {
    const ui = useContext(UI);
    const saved = ui.saved.includes(car.slug);
    const compared = ui.compare.includes(car.slug);
    return h('div', { className: 'react-car-tools' },
      h('button', {
        type: 'button', className: saved ? 'tool-button selected' : 'tool-button',
        'aria-pressed': saved, 'aria-label': `${saved ? 'Unsave' : 'Save'} ${car.name}`,
        onClick: () => ui.toggleSaved(car.slug)
      }, h('span', { 'aria-hidden': true }, saved ? '♥' : '♡'), saved ? ' Saved' : ' Save'),
      h('button', {
        type: 'button', className: compared ? 'tool-button selected' : 'tool-button',
        'aria-pressed': compared, 'aria-label': `${compared ? 'Remove' : 'Add'} ${car.name} ${compared ? 'from' : 'to'} comparison`,
        onClick: () => ui.toggleCompare(car.slug)
      }, compared ? '✓ Comparing' : '+ Compare'),
      quick && h('button', { type: 'button', className: 'tool-button', onClick: () => ui.setModal({ kind: 'quick', id: car.slug }), 'aria-label': `Quick view ${car.name}` }, 'Quick view ↗')
    );
  }

  function CarCard({ car }) {
    return h('article', { className: 'car-card react-card' },
      h('a', { className: 'car-image', href: modelUrl(car) },
        h('img', { src: image(car), alt: car.name + ' — illustrative stock photograph', loading: 'lazy', className: car.slug === 'porsche-911' ? 'classic-photo' : '' }),
        h('span', { className: 'image-tag' }, 'SAMPLE LISTING'), h('span', { className: 'round-arrow', 'aria-hidden': true }, '↗')),
      h('div', { className: 'car-meta' }, h('span', null, `${car.brand.toUpperCase()} / ${car.kind.toUpperCase()}`), h('span', null, car.color)),
      h('h3', null, h('a', { href: modelUrl(car) }, car.name)),
      h('div', { className: 'car-bottom' }, h('span', null, money(car.price), h('small', null, 'Illustrative price')), h('a', { href: modelUrl(car) }, 'Explore model ↗')),
      h(CarTools, { car })
    );
  }

  function FeaturedHero() {
    const slides = [cars.find(car => car.slug === 'bmw-m3'), ...cars.filter(car => car.slug !== 'bmw-m3')];
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    useEffect(() => {
      const media = matchMedia('(prefers-reduced-motion: reduce)');
      const changed = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
      media.addEventListener('change', changed);
      return () => media.removeEventListener('change', changed);
    }, []);
    useEffect(() => {
      if (!playing || hovered || focused || reduced) return;
      const timer = setInterval(() => { if (!document.hidden) setIndex(current => (current + 1) % slides.length); }, 6500);
      return () => clearInterval(timer);
    }, [playing, hovered, focused, reduced]);
    const car = slides[index];
    const bmw = car.slug === 'bmw-m3';
    const next = amount => { setPlaying(false); setIndex(current => (current + amount + slides.length) % slides.length); };
    return h('div', {
      className: 'hero-react-scene', role: 'region', 'aria-roledescription': 'carousel', 'aria-label': 'Featured sample cars',
      onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false),
      onFocusCapture: () => setFocused(true), onBlurCapture: event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }
    },
      h('div', { className: 'hero-orbit', 'aria-hidden': true }),
      h('div', { className: 'hero-topline' }, h('span', { className: 'eyebrow' }, 'THE DRIVE IS PERSONAL.'), h('span', { className: 'hero-edition' }, 'AUTOLAB / COLLECTION 01')),
      h('div', { className: 'hero-story' }, h('h1', null, 'GOOD CARS.', h('br'), 'GREAT ', h('em', null, 'INSTINCTS.')),
        h('p', null, 'Find the car that feels like you.', h('br'), 'Stay for everything that keeps it that way.'),
        h('a', { className: 'hero-explore', href: url('cars/') }, 'Explore the collection ', h('span', { 'aria-hidden': true }, '↗'))),
      h('div', { className: 'car-stage ' + (bmw ? '' : 'photo-stage'), key: car.slug },
        h('img', { className: bmw ? 'stage-image' : 'stage-photo', src: image(car), alt: car.name + ' featured stock photograph' })),
      h('div', { className: 'hero-dial', 'aria-hidden': true }, h('span', null, '0' + (index + 1)), h('small', null, 'OF 03', h('br'), 'FEATURED DRIVES')),
      h('div', { className: 'hero-wordmark ' + (!bmw ? 'long-wordmark' : ''), 'aria-hidden': true }, bmw ? 'BMW' : car.slug === 'porsche-911' ? '911' : 'PORSCHE', h('span', null, car.name.toUpperCase() + ' / 0' + (index + 1))),
      h('a', { className: 'hero-model-card', href: modelUrl(car) }, h('span', { className: 'eyebrow' }, 'IN FOCUS'), h('img', { src: image(car), alt: '' }), h('strong', null, car.name, h('span', { 'aria-hidden': true }, '↗')), h('small', null, car.color + ' / Sample vehicle')),
      h('div', { className: 'hero-live-label', 'aria-live': playing ? 'off' : 'polite', 'aria-atomic': true }, car.name + ' — featured model ' + (index + 1) + ' of 3'),
      h('div', { className: 'hero-bottomline' },
        h('div', { className: 'hero-selector' },
          h('div', { className: 'model-chips', role: 'group', 'aria-label': 'Select featured model' }, slides.map((slide, i) => h('button', { key: slide.slug, type: 'button', className: i === index ? 'selected' : '', 'aria-pressed': i === index, onClick: () => { setPlaying(false); setIndex(i); } }, slide.name))),
          h('div', { className: 'carousel-controls' },
            h('button', { type: 'button', 'aria-label': 'Previous featured car', onClick: () => next(-1) }, '←'),
            h('button', { type: 'button', 'aria-label': 'Next featured car', onClick: () => next(1) }, '→'),
            !reduced && h('button', { type: 'button', 'aria-pressed': playing, className: 'autoplay-control', onClick: () => setPlaying(value => !value) }, playing ? 'Ⅱ Pause rotation' : '▷ Auto rotate'))),
        h('a', { className: 'hero-service-link', href: url('services/') }, 'DISCOVER THE SERVICE CENTER ', h('span', { 'aria-hidden': true }, '↓')))
    );
  }

  const readFilters = () => {
    const query = new URLSearchParams(location.search);
    return { search: query.get('q') || '', brand: ['BMW', 'Porsche'].includes(query.get('brand')) ? query.get('brand') : '', kind: ['Sedan', 'Coupe', 'Grand tourer'].includes(query.get('kind')) ? query.get('kind') : '', sort: ['asc', 'desc'].includes(query.get('sort')) ? query.get('sort') : 'default', savedOnly: query.get('saved') === '1' };
  };

  function Collection() {
    const ui = useContext(UI);
    const [filters, setFilters] = useState(readFilters);
    useEffect(() => {
      const query = new URLSearchParams();
      if (filters.search) query.set('q', filters.search);
      if (filters.brand) query.set('brand', filters.brand);
      if (filters.kind) query.set('kind', filters.kind);
      if (filters.sort !== 'default') query.set('sort', filters.sort);
      if (filters.savedOnly) query.set('saved', '1');
      try { history.replaceState(null, '', location.pathname + (query.size ? '?' + query.toString() : '') + location.hash); } catch { /* File previews may restrict history updates. */ }
    }, [filters]);
    useEffect(() => { const back = () => setFilters(readFilters()); window.addEventListener('popstate', back); return () => window.removeEventListener('popstate', back); }, []);
    const update = (field, value) => setFilters(current => ({ ...current, [field]: value }));
    let filtered = cars.filter(car => `${car.name} ${car.kind} ${car.color}`.toLowerCase().includes(filters.search.trim().toLowerCase()) && (!filters.brand || car.brand === filters.brand) && (!filters.kind || car.kind === filters.kind) && (!filters.savedOnly || ui.saved.includes(car.slug)));
    if (filters.sort !== 'default') filtered = [...filtered].sort((a, b) => (a.price - b.price) * (filters.sort === 'asc' ? 1 : -1));
    const option = (value, label) => h('option', { value, key: value }, label || value);
    return h(React.Fragment, null,
      h('form', { className: 'filters', onSubmit: event => event.preventDefault() },
        h('label', null, 'Find a model', h('input', { type: 'search', value: filters.search, onChange: event => update('search', event.target.value), placeholder: 'Search Porsche, BMW…' })),
        h('label', null, 'Brand', h('select', { value: filters.brand, onChange: event => update('brand', event.target.value) }, option('', 'All brands'), option('BMW'), option('Porsche'))),
        h('label', null, 'Body style', h('select', { value: filters.kind, onChange: event => update('kind', event.target.value) }, option('', 'All body styles'), option('Sedan'), option('Coupe'), option('Grand tourer'))),
        h('label', null, 'Sort by', h('select', { value: filters.sort, onChange: event => update('sort', event.target.value) }, option('default', 'Featured'), option('asc', 'Price: low to high'), option('desc', 'Price: high to low'))),
        h('button', { type: 'button', className: 'reset', onClick: () => setFilters({ search: '', brand: '', kind: '', sort: 'default', savedOnly: false }) }, 'Reset ↺')),
      h('div', { className: 'results-line' }, h('span', { 'aria-live': 'polite' }, filtered.length + ' sample vehicle' + (filtered.length === 1 ? '' : 's')), h('button', { type: 'button', className: 'saved-filter ' + (filters.savedOnly ? 'selected' : ''), 'aria-pressed': filters.savedOnly, onClick: () => update('savedOnly', !filters.savedOnly) }, '♡ Saved only (' + ui.saved.length + ')')),
      filtered.length ? h('div', { className: 'car-grid', id: 'car-results' }, filtered.map(car => h(CarCard, { car, key: car.slug }))) : h('div', { className: 'collection-empty' }, h('span', { 'aria-hidden': true }, filters.savedOnly ? '♡' : '⌕'), h('h2', null, filters.savedOnly ? 'Your shortlist starts here.' : 'No matches just yet.'), h('p', null, filters.savedOnly ? 'Save a vehicle to see it here. Your favorites stay in this browser.' : 'Try another name, brand, or body style.'), h('button', { type: 'button', className: 'button orange', onClick: () => setFilters({ search: '', brand: '', kind: '', sort: 'default', savedOnly: false }) }, 'Show all vehicles ↗')),
      h('p', { className: 'collection-help fine' }, 'Save your favorites or compare up to three models. Prices and listings are illustrative; vehicles are not for sale.'));
  }

  function Modal({ children, title, close, className = '' }) {
    const ref = useRef(null);
    useEffect(() => {
      const dialog = ref.current;
      const previous = document.activeElement;
      dialog.showModal();
      return () => { dialog.close(); if (previous?.isConnected) previous.focus(); };
    }, []);
    return h('dialog', {
      ref, className: 'react-dialog ' + className, 'aria-labelledby': 'react-dialog-title',
      onCancel: event => { event.preventDefault(); close(); },
      onClick: event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }
    }, h('div', { className: 'dialog-heading' }, h('div', null, h('span', { className: 'eyebrow' }, 'YOUR AUTOLAB EXPERIENCE'), h('h2', { id: 'react-dialog-title' }, title)), h('button', { type: 'button', className: 'dialog-close', 'aria-label': 'Close dialog', onClick: close }, '×')), children);
  }

  function ShortlistModal() {
    const ui = useContext(UI);
    const savedCars = cars.filter(car => ui.saved.includes(car.slug));
    return h(Modal, { title: 'Your saved drives.', close: () => ui.setModal(null), className: 'saved-dialog' },
      h('p', { className: 'dialog-intro' }, 'A little room for your favorites. Saved on this browser only.'),
      savedCars.length ? h('div', { className: 'saved-list' }, savedCars.map(car => h('article', { className: 'saved-row', key: car.slug },
        h('a', { href: modelUrl(car) }, h('img', { src: image(car), alt: car.name })),
        h('div', null, h('h3', null, h('a', { href: modelUrl(car) }, car.name)), h('p', null, car.kind + ' / ' + car.color), h('span', null, money(car.price), h('small', null, ' Illustrative price'))),
        h('button', { type: 'button', className: 'icon-button', onClick: () => ui.toggleSaved(car.slug), 'aria-label': 'Unsave ' + car.name }, '×'),
        h('button', { type: 'button', className: 'tool-button', onClick: () => ui.toggleCompare(car.slug), 'aria-pressed': ui.compare.includes(car.slug) }, ui.compare.includes(car.slug) ? '✓ Comparing' : '+ Compare')))) : h('div', { className: 'collection-empty' }, h('span', { 'aria-hidden': true }, '♡'), h('h3', null, 'Nothing saved yet.'), h('p', null, 'Tap Save on a vehicle to start your shortlist.'), h('a', { className: 'button orange', href: url('cars/') }, 'Explore the collection ↗')),
      savedCars.length > 0 && h('div', { className: 'dialog-footer' }, h('a', { className: 'underlink', href: url('cars/?saved=1') }, 'Open saved collection ↗'), h('button', { type: 'button', className: 'button orange', disabled: ui.compare.length < 2, onClick: () => ui.setModal({ kind: 'compare' }) }, 'Compare selected (' + ui.compare.length + ')')));
  }

  function CompareModal() {
    const ui = useContext(UI);
    const selection = ui.compare.map(id => cars.find(car => car.slug === id)).filter(Boolean);
    const specs = [['Illustrative price', car => money(car.price)], ['Brand', car => car.brand], ['Body style', car => car.kind], ['Display color', car => car.color], ['Listing status', () => 'Demo only · not for sale']];
    return h(Modal, { title: 'Different drives. Side by side.', close: () => ui.setModal(null), className: 'compare-dialog' },
      h('p', { className: 'dialog-intro' }, 'Compare the sample listing details. These are not verified vehicle specifications or real offers.'),
      selection.length >= 2 ? h('div', { className: 'comparison-scroll', tabIndex: 0, role: 'region', 'aria-label': 'Vehicle comparison table' }, h('table', { className: 'comparison-table' },
        h('caption', { className: 'sr-only' }, 'Comparison of selected fictional vehicle listings'),
        h('thead', null, h('tr', null, h('th', { scope: 'col' }, 'Sample listing'), selection.map(car => h('th', { key: car.slug, scope: 'col' }, h('img', { src: image(car), alt: car.name }), h('h3', null, car.name), h('button', { type: 'button', className: 'remove-link', onClick: () => ui.toggleCompare(car.slug), 'aria-label': 'Remove ' + car.name + ' from comparison' }, 'Remove ×'))))),
        h('tbody', null, specs.map(([label, read]) => h('tr', { key: label }, h('th', { scope: 'row' }, label), selection.map(car => h('td', { key: car.slug }, read(car))))),
          h('tr', null, h('th', { scope: 'row' }, 'Explore'), selection.map(car => h('td', { key: car.slug }, h('a', { className: 'underlink', href: modelUrl(car) }, 'View model ↗'))))))
      ) : h('div', { className: 'collection-empty' }, h('h3', null, 'Choose at least two vehicles.'), h('p', null, 'Add another model from the collection to compare side by side.'), h('a', { className: 'button orange', href: url('cars/') }, 'Browse the collection ↗')),
      h('div', { className: 'dialog-footer' }, h('span', { className: 'fine' }, 'Compare up to 3 sample vehicles.'), h('button', { type: 'button', className: 'underlink clear-button', onClick: () => { ui.clearCompare(); ui.setModal(null); } }, 'Clear comparison')));
  }

  function QuickView({ id }) {
    const ui = useContext(UI);
    const car = cars.find(item => item.slug === id);
    if (!car) return null;
    return h(Modal, { title: car.name, close: () => ui.setModal(null), className: 'quick-dialog' },
      h('img', { className: 'quick-photo', src: image(car), alt: car.name + ' reference photograph' }),
      h('div', { className: 'quick-meta' }, h('span', null, car.kind + ' / ' + car.color), h('strong', null, money(car.price), h('small', null, ' Illustrative price'))),
      h('p', null, car.intro), h('ul', { className: 'check-list' }, car.features.map(feature => h('li', { key: feature }, feature))),
      h(CarTools, { car, quick: false }), h('a', { className: 'button orange quick-link', href: modelUrl(car) }, 'See the full model page ↗'), h('p', { className: 'fine' }, 'Sample listing and reference photo. No real vehicle is offered for sale.'));
  }

  function CompareTray() {
    const ui = useContext(UI);
    if (!ui.compare.length) return null;
    return h('aside', { className: 'compare-tray', 'aria-label': 'Vehicle comparison shortlist' },
      h('div', { className: 'tray-label' }, h('strong', null, 'YOUR NEXT DRIVE'), h('span', null, ui.compare.length + ' of 3 selected')),
      h('div', { className: 'tray-cars' }, ui.compare.map(id => { const car = cars.find(item => item.slug === id); return h('div', { className: 'tray-car', key: id }, h('img', { src: image(car), alt: car.name }), h('button', { type: 'button', onClick: () => ui.toggleCompare(id), 'aria-label': 'Remove ' + car.name + ' from comparison' }, '×')); })),
      h('button', { type: 'button', className: 'button orange', disabled: ui.compare.length < 2, onClick: () => ui.setModal({ kind: 'compare' }) }, ui.compare.length < 2 ? 'Add one more to compare' : 'Compare models ↗'),
      h('button', { type: 'button', className: 'tray-clear', 'aria-label': 'Clear comparison', onClick: ui.clearCompare }, '×'));
  }

  function App() {
    const [shortlist, setShortlist] = useState(readShortlist);
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState('');
    const [storageAvailable, setStorageAvailable] = useState(true);
    useEffect(() => {
      try { localStorage.setItem(storeKey, JSON.stringify(shortlist)); setStorageAvailable(true); }
      catch { setStorageAvailable(false); }
    }, [shortlist]);
    useEffect(() => {
      const sync = event => { if (event.key === storeKey) setShortlist(readShortlist()); };
      window.addEventListener('storage', sync);
      return () => window.removeEventListener('storage', sync);
    }, []);
    useEffect(() => { if (!toast) return; const timeout = setTimeout(() => setToast(''), 2700); return () => clearTimeout(timeout); }, [toast]);
    const toggleSaved = id => {
      const exists = shortlist.saved.includes(id);
      setShortlist(current => ({ ...current, saved: current.saved.includes(id) ? current.saved.filter(item => item !== id) : [...current.saved, id] }));
      setToast(exists ? 'Removed from your saved drives.' : 'Added to your saved drives.');
    };
    const toggleCompare = id => {
      if (!shortlist.compare.includes(id) && shortlist.compare.length >= 3) { setToast('You can compare up to 3 models. Remove one to add another.'); return; }
      const exists = shortlist.compare.includes(id);
      setShortlist(current => ({ ...current, compare: current.compare.includes(id) ? current.compare.filter(item => item !== id) : [...current.compare, id].slice(0, 3) }));
      setToast(exists ? 'Removed from comparison.' : 'Added to comparison.');
    };
    const ui = { ...shortlist, toggleSaved, toggleCompare, clearCompare: () => setShortlist(current => ({ ...current, compare: [] })), modal, setModal };
    return h(UI.Provider, { value: ui },
      headerTarget && createPortal(h('button', { type: 'button', className: 'header-saved', onClick: () => setModal({ kind: 'saved' }), 'aria-label': 'Open saved vehicles, ' + shortlist.saved.length + ' saved' }, h('span', { 'aria-hidden': true }, '♡'), h('span', { className: 'saved-word' }, ' Saved'), h('b', null, shortlist.saved.length)), headerTarget),
      heroTarget && createPortal(h(FeaturedHero), heroTarget),
      collectionTarget && createPortal(h(Collection), collectionTarget),
      toolsTargets.map((target, i) => { const car = cars.find(item => item.slug === target.dataset.carTools); return car ? createPortal(h(CarTools, { car }), target, 'tools-' + i) : null; }),
      h(CompareTray),
      modal?.kind === 'saved' && h(ShortlistModal),
      modal?.kind === 'compare' && h(CompareModal),
      modal?.kind === 'quick' && h(QuickView, { id: modal.id }),
      h('div', { className: 'react-toast ' + (toast ? 'show' : ''), role: 'status', 'aria-live': 'polite' }, toast, toast && !storageAvailable && ' Saved for this visit only; browser storage is unavailable.')
    );
  }
  createRoot(document.getElementById('react-ui')).render(h(App));
})();
