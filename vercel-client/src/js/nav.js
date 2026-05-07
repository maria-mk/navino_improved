const SECTIONS = [
    { id: 'personal',     label: 'Персональные подборки' },
    { id: 'offers',       label: 'Выгодные предложения' },
    { id: 'degustation',  label: 'Дегустации' },
    { id: 'learning',     label: 'Обучение' },
];

const isIndexPage = () => {
    const p = window.location.pathname;
    return p.endsWith('index.html') || p === '/' || p.endsWith('/');
};

let activeSection = new URLSearchParams(window.location.search).get('section') || 'offers';

function setActive(id) {
    if (!isIndexPage()) {
        window.location.href = `index.html?section=${id}`;
        return;
    }
    activeSection = id;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('button--color-active', btn.dataset.section === id);
    });
    document.dispatchEvent(new CustomEvent('navino:section-changed', { detail: { section: id } }));
}

function loadNav() {
    const items = SECTIONS.map(s => `
        <li>
            <button class="button nav-btn${s.id === activeSection ? ' button--color-active' : ''}" data-section="${s.id}">
                ${s.label}
            </button>
        </li>
    `).join('');

    document.getElementById('nav-container').innerHTML = `
        <div class="container nav-container">
            <ul>${items}</ul>
        </div>
    `;

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => setActive(btn.dataset.section));
    });
}

loadNav();
