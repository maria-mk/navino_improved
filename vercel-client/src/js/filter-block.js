import { toggleColor, toggleSugar, toggleType, setPriceRange } from './state.js';

let dropdownExpanded = false;

const showCheckboxes = () => {
    const checkboxes = document.getElementById('checkboxes');
    if (!checkboxes) return;
    dropdownExpanded = !dropdownExpanded;
    checkboxes.style.display = dropdownExpanded ? 'block' : 'none';
};

const renderFilters = () => {
    const container = document.getElementById('filter-container');
    if (!container) throw new Error('#filter-container not found');

    container.innerHTML = `
        <ul>
            <li>
                <button class="filter-name"><h5>ТОРГОВАЯ СЕТЬ</h5></button>
            </li>
            <li>
                <form>
                    <div class="multiselect">
                        <div class="selectBox">
                            <select>
                                <option>Выберите магазин</option>
                            </select>
                            <div class="overSelect"></div>
                        </div>
                        <div id="checkboxes">
                            ${['Перекресток', 'Ароматный Мир', 'Лента', 'Красное и Белое', 'ВинЛаб', 'Пятерочка', 'Дикси']
                                .map((store, i) => `
                                    <label for="store-${i}">
                                        <input type="checkbox" id="store-${i}"> ${store}
                                    </label>
                                `).join('')}
                        </div>
                    </div>
                </form>
            </li>
            <li>
                <button class="filter-name"><h5>ЦЕНА</h5></button>
            </li>
            <li>
                <div class="price-range">
                    <input class="filter_number_button" type="number" id="price-min" placeholder="ОТ">
                    <input class="filter_number_button" type="number" id="price-max" placeholder="ДО">
                </div>
            </li>
            <li>
                <button class="filter-name"><h5>РАЗМЕР СКИДКИ</h5></button>
            </li>
            <li>
                <div class="discount-range">
                    <input class="filter_number_button" type="number" placeholder="ОТ 1%">
                    <input class="filter_number_button" type="number" placeholder="ДО 99%">
                </div>
            </li>
            <li>
                <button class="filter-name"><h5>ТИП ВИНА</h5></button>
            </li>
            <li>
                <div class="wine-type">
                    ${['Тихое', 'Игристое', 'Крепленое', 'Десертное']
                        .map(t => `<button class="filter_text_button" data-filter="type" data-value="${t}">${t}</button>`)
                        .join('')}
                </div>
            </li>
            <li>
                <button class="filter-name"><h5>ЦВЕТ ВИНА</h5></button>
            </li>
            <li>
                <div class="wine-color">
                    ${['Белое', 'Красное', 'Розовое', 'Оранжевое']
                        .map(c => `<button class="filter_text_button" data-filter="color" data-value="${c}">${c}</button>`)
                        .join('')}
                </div>
            </li>
            <li>
                <button class="filter-name"><h5>СОДЕРЖАНИЕ САХАРА</h5></button>
            </li>
            <li>
                <div class="sugar-content">
                    ${['Сухое', 'Полусухое', 'Полусладкое', 'Сладкое']
                        .map(s => `<button class="filter_text_button" data-filter="sugar" data-value="${s}">${s}</button>`)
                        .join('')}
                </div>
            </li>
        </ul>
    `;
};

const initializeEventHandlers = () => {
    const selectBox = document.querySelector('.selectBox');
    if (selectBox) selectBox.addEventListener('click', showCheckboxes);

    const filterContainer = document.getElementById('filter-container');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter_text_button');
        if (!btn) return;

        btn.classList.toggle('filter_button--color-active');
        const value  = btn.dataset.value;
        const filter = btn.dataset.filter;

        if (filter === 'color') toggleColor(value);
        else if (filter === 'type') toggleType(value);
        else if (filter === 'sugar') toggleSugar(value);
    });

    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');

    const applyPrice = () => {
        setPriceRange(
            priceMin?.value ?? '',
            priceMax?.value ?? '',
        );
    };

    priceMin?.addEventListener('change', applyPrice);
    priceMax?.addEventListener('change', applyPrice);
};

document.addEventListener('DOMContentLoaded', () => {
    renderFilters();
    initializeEventHandlers();
});
