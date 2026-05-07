import { state } from './state.js';
import { currentUser, isLoggedIn } from './auth.js';

/* ─── Static data ─── */

const DEGUSTATION_EVENTS = [
    {
        date: '14 июня 2025',
        title: 'Вина Бургундии: от Шабли до Вон-Романе',
        place: 'Wine Room, Рубинштейна 5',
        price: '3 500 ₽',
        spots: 12,
        tags: ['Белое', 'Красное', 'Премиум'],
        desc: 'Горизонтальная дегустация восьми апелласьонов Бургундии с сомелье Андреем Ивановым.',
    },
    {
        date: '21 июня 2025',
        title: 'Натуральные вина: мифы и реальность',
        place: 'Le Petit, Петроградская наб. 18',
        price: '2 200 ₽',
        spots: 16,
        tags: ['Натуральное', 'Оранжевое'],
        desc: 'Шесть натуральных вин без добавок от небольших хозяйств Грузии, Австрии и Франции.',
    },
    {
        date: '28 июня 2025',
        title: 'Игристые вина мира: Pro & Contra',
        place: 'Bubbles Bar, Невский 22',
        price: '2 800 ₽',
        spots: 20,
        tags: ['Игристое', 'Просекко', 'Кава'],
        desc: 'Слепая дегустация 7 игристых вин: Шампань против альтернатив. Угадай Шампань!',
    },
    {
        date: '5 июля 2025',
        title: 'Грузия: 8000 лет виноделия',
        place: 'Кахети, Лиговский пр. 50',
        price: '2 000 ₽',
        spots: 24,
        tags: ['Грузия', 'Оранжевое', 'Квеври'],
        desc: 'Погружение в грузинское виноделие: Ркацители, Саперави и вина в квеври с закусками.',
    },
    {
        date: '12 июля 2025',
        title: 'Риоха vs Рибера-дель-Дуэро',
        place: 'Испанский дом, Садовая 42',
        price: '2 600 ₽',
        spots: 18,
        tags: ['Испания', 'Красное', 'Темпранильо'],
        desc: 'Сравнительная дегустация двух главных испанских регионов. Семь вин, один сорт.',
    },
    {
        date: '19 июля 2025',
        title: 'Российские вина 2024: новый уровень',
        place: 'Chateau Tamagne Pop-up, Галерея',
        price: '1 800 ₽',
        spots: 30,
        tags: ['Россия', 'Красное', 'Белое'],
        desc: 'Шесть вин от лучших российских хозяйств урожая 2024 года. Вход с закусками.',
    },
];

const LEARNING_COURSES = [
    {
        level: 'Начинающий',
        title: 'Основы виноделия и дегустации',
        duration: '4 занятия · 8 часов',
        price: '6 900 ₽',
        icon: '🍇',
        desc: 'С нуля: как читать этикетку, определять стиль вина, что такое терруар и как проводится профессиональная дегустация.',
    },
    {
        level: 'Начинающий',
        title: 'Вино и еда: правила и исключения',
        duration: '2 занятия · 4 часа',
        price: '3 200 ₽',
        icon: '🍽️',
        desc: 'Классические сочетания и нестандартные пары. Почему красное с рыбой иногда работает лучше белого.',
    },
    {
        level: 'Средний',
        title: 'Путеводитель по Франции',
        duration: '6 занятий · 12 часов',
        price: '12 500 ₽',
        icon: '🇫🇷',
        desc: 'Бордо, Бургундия, Долина Луары, Эльзас, Рона — шесть регионов с дегустацией представительных вин каждого.',
    },
    {
        level: 'Средний',
        title: 'Шампань и игристые вина',
        duration: '3 занятия · 6 часов',
        price: '8 400 ₽',
        icon: '🥂',
        desc: 'Методы производства, дозаж, категории и виноградари Шампани. Сравнение с Кавой, Просекко и Петнатом.',
    },
    {
        level: 'Продвинутый',
        title: 'Подготовка к WSET Level 2',
        duration: '8 занятий · 16 часов',
        price: '18 000 ₽',
        icon: '📜',
        desc: 'Структурированная программа для сдачи международного экзамена WSET Level 2 с куратором и пробными тестами.',
    },
    {
        level: 'Продвинутый',
        title: 'Инвестиции в вино',
        duration: '2 занятия · 4 часа',
        price: '5 500 ₽',
        icon: '📈',
        desc: 'Как формируется стоимость коллекционного вина, en primeur, Wine Lister и стратегии для частного инвестора.',
    },
];

const LEVEL_COLORS = {
    'Начинающий':  { bg: 'rgba(155,110,40,0.1)',  color: 'var(--color-gold)' },
    'Средний':     { bg: 'rgba(139,38,53,0.08)',  color: 'var(--color-wine)' },
    'Продвинутый': { bg: 'rgba(28,20,16,0.07)',   color: 'var(--color-text)' },
};

const FAKE_ORDERS = [
    { date: '03.05.2025', items: 'Chateau Tamagne Reserve Rouge 2021, Massandra Muscat', total: '4 280 ₽', status: 'Доставлено' },
    { date: '14.04.2025', items: 'Fanagoria Antiqua Riesling 2022', total: '1 890 ₽', status: 'Доставлено' },
    { date: '28.03.2025', items: 'Lefkadia Cabernet Sauvignon 2020 × 2', total: '5 600 ₽', status: 'Доставлено' },
    { date: '10.02.2025', items: 'Abrau-Durso Blanc de Blancs Brut', total: '2 100 ₽', status: 'Доставлено' },
];

/* ─── Render helpers ─── */

export function renderDegustation(container) {
    container.innerHTML = `
        <div class="section-page">
            <div class="section-page__header">
                <h2>Дегустации</h2>
                <p>Авторские вечера с профессиональными сомелье. Учитесь чувствовать вино в хорошей компании.</p>
            </div>
            <div class="events-grid">
                ${DEGUSTATION_EVENTS.map(ev => `
                    <div class="event-card">
                        <div class="event-card__date">${ev.date}</div>
                        <h4 class="event-card__title">${ev.title}</h4>
                        <p class="event-card__desc">${ev.desc}</p>
                        <div class="event-card__tags">
                            ${ev.tags.map(t => `<span class="event-card__tag">${t}</span>`).join('')}
                        </div>
                        <div class="event-card__footer">
                            <div class="event-card__meta">
                                <span class="event-card__place">📍 ${ev.place}</span>
                                <span class="event-card__spots">${ev.spots} мест</span>
                            </div>
                            <div class="event-card__bottom">
                                <span class="event-card__price">${ev.price}</span>
                                <button class="event-card__btn">Записаться</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

export function renderLearning(container) {
    container.innerHTML = `
        <div class="section-page">
            <div class="section-page__header">
                <h2>Обучение</h2>
                <p>От первого бокала до международного сертификата. Офлайн-курсы в Санкт-Петербурге.</p>
            </div>
            <div class="courses-grid">
                ${LEARNING_COURSES.map(c => {
                    const lc = LEVEL_COLORS[c.level] || LEVEL_COLORS['Начинающий'];
                    return `
                        <div class="course-card">
                            <div class="course-card__icon">${c.icon}</div>
                            <span class="course-card__level" style="background:${lc.bg}; color:${lc.color}">${c.level}</span>
                            <h4 class="course-card__title">${c.title}</h4>
                            <p class="course-card__desc">${c.desc}</p>
                            <div class="course-card__footer">
                                <span class="course-card__duration">${c.duration}</span>
                                <div class="course-card__bottom">
                                    <span class="course-card__price">${c.price}</span>
                                    <button class="course-card__btn">Подробнее</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

export function renderPersonal(container) {
    if (!isLoggedIn()) {
        container.innerHTML = `
            <div class="auth-gate">
                <div class="auth-gate__icon">🔒</div>
                <h3 class="auth-gate__title">Нужна авторизация</h3>
                <p class="auth-gate__desc">Персональные подборки доступны только зарегистрированным пользователям.<br>Войдите в аккаунт, чтобы увидеть рекомендации, историю заказов и избранное.</p>
                <button class="auth-gate__btn">Войти в аккаунт</button>
            </div>
        `;
        return;
    }

    const topWines = [...state.allProducts]
        .filter(p => {
            const r = parseFloat(state.ratingCache[p.id]);
            return !isNaN(r) && r >= 4.0;
        })
        .sort((a, b) => (parseFloat(state.ratingCache[b.id]) || 0) - (parseFloat(state.ratingCache[a.id]) || 0))
        .slice(0, 6);

    const wineCards = topWines.map(p => {
        const prices = state.priceCache[p.id] || [];
        const minPrice = prices.length > 0 ? Math.min(...prices.map(x => x.price)) : 0;
        const rating = state.ratingCache[p.id] ?? '—';
        return `
            <a href="page2.html?productId=${p.id}" class="lk-wine-card">
                <img class="lk-wine-card__img" src="${p.image}" alt="${p.title}">
                <div class="lk-wine-card__info">
                    <p class="lk-wine-card__name">${p.title}</p>
                    <div class="lk-wine-card__meta">
                        <span class="lk-wine-card__rating">★ ${rating}</span>
                        <span class="lk-wine-card__price">от ${minPrice} ₽</span>
                    </div>
                </div>
            </a>
        `;
    }).join('');

    const ordersRows = FAKE_ORDERS.map(o => `
        <tr class="lk-orders__row">
            <td>${o.date}</td>
            <td class="lk-orders__items">${o.items}</td>
            <td><strong>${o.total}</strong></td>
            <td><span class="lk-orders__status">${o.status}</span></td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="section-page lk-page">

            <!-- Profile header -->
            <div class="lk-profile">
                <div class="lk-profile__avatar">${currentUser.initials}</div>
                <div class="lk-profile__info">
                    <h3 class="lk-profile__name">${currentUser.fullName}</h3>
                    <p class="lk-profile__email">${currentUser.email}</p>
                    <p class="lk-profile__since">С нами с ${currentUser.since}</p>
                </div>
                <div class="lk-profile__level">
                    <span class="lk-profile__level-badge">${currentUser.level}</span>
                    <p class="lk-profile__level-hint">следующий: Gold</p>
                </div>
            </div>

            <!-- Stats -->
            <div class="lk-stats">
                <div class="lk-stat">
                    <span class="lk-stat__value">${currentUser.orders}</span>
                    <span class="lk-stat__label">Заказов</span>
                </div>
                <div class="lk-stat">
                    <span class="lk-stat__value">${currentUser.favorites}</span>
                    <span class="lk-stat__label">В избранном</span>
                </div>
                <div class="lk-stat">
                    <span class="lk-stat__value">${currentUser.reviews}</span>
                    <span class="lk-stat__label">Отзывов</span>
                </div>
                <div class="lk-stat">
                    <span class="lk-stat__value">2 400 ₽</span>
                    <span class="lk-stat__label">Сэкономлено</span>
                </div>
            </div>

            <!-- Recommendations -->
            ${topWines.length > 0 ? `
                <div class="lk-section">
                    <h4 class="lk-section__title">Рекомендации для вас</h4>
                    <div class="lk-wines">${wineCards}</div>
                </div>
            ` : ''}

            <!-- Orders -->
            <div class="lk-section">
                <h4 class="lk-section__title">История заказов</h4>
                <div class="lk-orders-wrap">
                    <table class="lk-orders">
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Состав</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                            </tr>
                        </thead>
                        <tbody>${ordersRows}</tbody>
                    </table>
                </div>
            </div>

        </div>
    `;
}
