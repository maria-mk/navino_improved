import { getLogoTemplate, getGeoTemplate, getSearchTemplate } from './icons';
import { refreshBadges } from './cart.js';
import { currentUser, isLoggedIn } from './auth.js';

function loadHeader() {
    const loggedIn = isLoggedIn();

    const userBlock = loggedIn
        ? `<div class="header-user">
               <div class="header-user__avatar">${currentUser.initials}</div>
               <span class="header-user__name">${currentUser.name}</span>
           </div>`
        : `<a href="#" class="login-link">Войти</a>`;

    const headerHTML = `
        <header class="header">
            <div class="header-content">
                <div class="header-logo-wrap">
                    ${getLogoTemplate()}
                    <h2 class="logo"><a href="index.html">NaVino</a></h2>
                </div>
                <ul class="header-navigation">
                    <li>
                        <div style="position: relative; width: 100%;">
                            <input type="text" class="search" id="search-input" placeholder="Chateau Tamagne">
                            <div class="search-icon">${getSearchTemplate()}</div>
                        </div>
                    </li>
                    <li>
                        ${getGeoTemplate()}
                        <select class="option">
                            <option>Москва</option>
                            <option selected>Санкт-Петербург</option>
                        </select>
                    </li>
                    <li>
                        <a href="comparison.html" class="header-icon-btn" title="Сравнение вин">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="2" y="5" width="5" height="14" rx="1"/>
                                <rect x="9.5" y="9" width="5" height="10" rx="1"/>
                                <rect x="17" y="2" width="5" height="17" rx="1"/>
                            </svg>
                            <span class="badge cmp-badge badge--hidden">0</span>
                        </a>
                    </li>
                    <li>
                        <button class="header-icon-btn" title="Избранное">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            <span class="badge fav-badge badge--hidden">0</span>
                        </button>
                    </li>
                    <li>
                        <button class="header-icon-btn" title="Корзина">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="9" cy="21" r="1"/>
                                <circle cx="20" cy="21" r="1"/>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            <span class="badge cart-badge badge--hidden">0</span>
                        </button>
                    </li>
                    <li>
                        ${userBlock}
                    </li>
                </ul>
            </div>
        </header>
    `;

    document.getElementById('header-container').innerHTML = headerHTML;

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            document.dispatchEvent(new CustomEvent('navino:search-changed', {
                detail: { value: e.target.value },
            }));
        });
    }

    const userEl = document.querySelector('.header-user');
    if (userEl) {
        userEl.addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('navino:section-changed', {
                detail: { section: 'personal' },
            }));
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.toggle('button--color-active', btn.dataset.section === 'personal');
            });
        });
    }

    refreshBadges();
}

loadHeader();
