import { getProductById, getPriceByProductId, getReviewsByProductId } from './api.js';
import { getCompare, removeFromCompare, refreshBadges } from './cart.js';

const renderComparison = async () => {
    const container = document.getElementById('comparison-container');
    if (!container) return;

    const compareList = getCompare();

    if (compareList.length === 0) {
        container.innerHTML = `
            <div class="comparison-empty">
                <p>Вы ещё не добавили вина для сравнения</p>
                <a href="index.html" class="btn-primary">Перейти к каталогу</a>
            </div>
        `;
        return;
    }

    container.innerHTML = '<div class="comparison-loading">Загружаем данные...</div>';

    try {
        const productData = await Promise.all(
            compareList.map(async ({ id }) => {
                const [product, prices, reviews] = await Promise.all([
                    getProductById(id),
                    getPriceByProductId(id),
                    getReviewsByProductId(id),
                ]);
                const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
                const avgRating = reviews.length > 0
                    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
                    : 'Нет отзывов';
                return { ...product, minPrice, avgRating };
            })
        );

        const cols = productData.length;
        const gridCols = `160px repeat(${cols}, 1fr)`;

        const rows = [
            {
                label: 'Вино',
                render: p => `
                    <div class="cmp-cell cmp-cell--header">
                        <button class="cmp-remove" data-id="${p.id}" title="Убрать из сравнения">×</button>
                        <img src="${p.image}" alt="${p.title}">
                        <h4>${p.title}</h4>
                    </div>`,
            },
            {
                label: 'Рейтинг',
                render: p => `<div class="cmp-cell"><span class="cmp-rating">★ ${p.avgRating}</span></div>`,
            },
            {
                label: 'Цвет',
                render: p => `<div class="cmp-cell">${p.color}</div>`,
            },
            {
                label: 'Сахар',
                render: p => `<div class="cmp-cell">${p.sugar}</div>`,
            },
            {
                label: 'Тип',
                render: p => `<div class="cmp-cell">${p.type}</div>`,
            },
            {
                label: 'Вкус',
                render: p => `<div class="cmp-cell cmp-cell--text">${p.taste}</div>`,
            },
            {
                label: 'Аромат',
                render: p => `<div class="cmp-cell cmp-cell--text">${p.aroma}</div>`,
            },
            {
                label: 'Цена от',
                render: p => `<div class="cmp-cell cmp-cell--price">${p.minPrice} ₽</div>`,
            },
            {
                label: '',
                render: p => `
                    <div class="cmp-cell">
                        <a href="page2.html?productId=${p.id}" class="cmp-link">Подробнее</a>
                    </div>`,
            },
        ];

        const tableHTML = rows.map(row => `
            <div class="cmp-label">${row.label}</div>
            ${productData.map(row.render).join('')}
        `).join('');

        container.innerHTML = `
            <div class="comparison-table" style="grid-template-columns: ${gridCols}">
                ${tableHTML}
            </div>
        `;

        container.querySelectorAll('.cmp-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCompare(e.currentTarget.dataset.id);
                renderComparison();
            });
        });

    } catch (err) {
        console.error('Ошибка при загрузке данных для сравнения:', err);
        container.innerHTML = '<p style="padding:40px;text-align:center;color:var(--color-accent)">Не удалось загрузить данные. Попробуйте позже.</p>';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    renderComparison();
    refreshBadges();
});
