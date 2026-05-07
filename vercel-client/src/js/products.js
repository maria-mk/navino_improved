import { getAllProducts, getPriceByProductId, getReviewsByProductId } from './api.js';
import { state, getFiltered, setSearch } from './state.js';
import { isFavorite, toggleFavorite, addToCart, toggleCompare, isInCompare, refreshBadges } from './cart.js';
import { renderDegustation, renderLearning, renderPersonal } from './sections.js';


let currentSection = new URLSearchParams(window.location.search).get('section') || 'offers';

const createProductCard = (product) => {
    const { id, title, image, color, sugar, type } = product;
    const prices   = state.priceCache[id] || [];
    const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
    const avgRating = state.ratingCache[id] ?? 'Нет отзывов';
    const fav   = isFavorite(id);
    const inCmp = isInCompare(id);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = id;

    card.innerHTML = `
        <div class="product-card__image-wrap">
            <img class="product-card__image" src="${image}" alt="${title}">
            <button class="product-card__fav${fav ? ' product-card__fav--active' : ''}" data-id="${id}" title="В избранное">
                <svg viewBox="0 0 24 24" fill="${fav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            </button>
        </div>
        <div class="product-card__content">
            <h3 class="product-card__title">${title.toUpperCase()}</h3>
            <div class="product-card__rating">
                <span class="product-card__star">★</span>
                <span class="product-card__rating-value">${avgRating}</span>
            </div>
            <div class="product-card__tags">
                <span class="product-card__tag">${color}</span>
                <span class="product-card__tag">${sugar}</span>
                <span class="product-card__tag">${type}</span>
            </div>
            <div class="product-card__footer">
                <p class="product-card__price">от <strong>${minPrice} ₽</strong></p>
                <div class="product-card__actions">
                    <button class="product-card__btn product-card__btn--cart" data-id="${id}">В корзину</button>
                    <a href="page2.html?productId=${id}" class="product-card__btn product-card__btn--primary">
                        Подробнее
                    </a>
                </div>
                <button class="product-card__compare${inCmp ? ' product-card__compare--active' : ''}" data-id="${id}">
                    ${inCmp ? '✓ Сравниваем' : '+ Сравнить'}
                </button>
            </div>
        </div>
    `;

    card.querySelector('.product-card__fav').addEventListener('click', (e) => {
        e.preventDefault();
        const isNowFav = toggleFavorite({ id, title, image });
        const btn = e.currentTarget;
        btn.classList.toggle('product-card__fav--active', isNowFav);
        btn.querySelector('svg').setAttribute('fill', isNowFav ? 'currentColor' : 'none');
    });

    card.querySelector('.product-card__btn--cart').addEventListener('click', (e) => {
        addToCart({ id, title, image, minPrice });
        const btn = e.currentTarget;
        const original = btn.textContent;
        btn.textContent = 'Добавлено!';
        setTimeout(() => { btn.textContent = original; }, 1400);
    });

    card.querySelector('.product-card__compare').addEventListener('click', (e) => {
        const result = toggleCompare({ id });
        const btn = e.currentTarget;
        if (result === null) {
            btn.textContent = 'Макс. 3 вина';
            setTimeout(() => {
                btn.textContent = isInCompare(id) ? '✓ Сравниваем' : '+ Сравнить';
            }, 1400);
            return;
        }
        btn.classList.toggle('product-card__compare--active', result);
        btn.textContent = result ? '✓ Сравниваем' : '+ Сравнить';
    });

    return card;
};

const renderProductGrid = (products) => {
    const container = document.querySelector('.products');
    if (!container) return;
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = `
            <div class="products__empty">
                <p>По вашему запросу ничего не найдено</p>
                <button class="products__reset" id="reset-filters">Сбросить фильтры</button>
            </div>
        `;
        document.getElementById('reset-filters')?.addEventListener('click', () => location.reload());
        return;
    }

    products.forEach(product => container.appendChild(createProductCard(product)));
};

const setSidebarVisible = (visible) => {
    const aside = document.querySelector('aside');
    if (aside) aside.style.display = visible ? '' : 'none';
};

const renderFiltered = () => {
    if (currentSection !== 'offers') return;
    const container = document.querySelector('.products');
    if (!container || state.allProducts.length === 0) return;
    container.style.display = '';
    renderProductGrid(getFiltered());
};

const handleSectionChange = (section) => {
    currentSection = section;
    const container = document.querySelector('.products');
    if (!container) return;

    if (section === 'degustation') {
        setSidebarVisible(false);
        container.style.display = 'block';
        renderDegustation(container);
    } else if (section === 'learning') {
        setSidebarVisible(false);
        container.style.display = 'block';
        renderLearning(container);
    } else if (section === 'personal') {
        setSidebarVisible(false);
        container.style.display = 'block';
        renderPersonal(container);
    } else {
        setSidebarVisible(true);
        container.style.display = '';
        renderFiltered();
    }
};

const displayProducts = async () => {
    const container = document.querySelector('.products');
    if (!container) return;

    container.innerHTML = '<div class="products__loading">Загружаем коллекцию...</div>';

    try {
        const products = await getAllProducts();

        const [allPrices, allRatings] = await Promise.all([
            Promise.all(products.map(p => getPriceByProductId(p.id))),
            Promise.all(products.map(p => getReviewsByProductId(p.id))),
        ]);

        products.forEach((p, i) => {
            state.priceCache[p.id] = allPrices[i];
            const reviews = allRatings[i];
            state.ratingCache[p.id] = reviews.length > 0
                ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                : 'Нет отзывов';
        });

        state.allProducts = products;

        const urlSection = new URLSearchParams(window.location.search).get('section');
        if (urlSection && urlSection !== 'offers') {
            handleSectionChange(urlSection);
        } else {
            renderFiltered();
        }
        refreshBadges();
    } catch (err) {
        console.error('Ошибка при загрузке продуктов:', err);
        const container = document.querySelector('.products');
        if (container) {
            container.innerHTML = '<p class="products__error">Не удалось загрузить продукты. Попробуйте позже.</p>';
        }
    }
};

document.addEventListener('navino:search-changed', (e) => { setSearch(e.detail.value); });
document.addEventListener('navino:filters-changed', renderFiltered);
document.addEventListener('navino:section-changed', (e) => handleSectionChange(e.detail.section));

displayProducts();
