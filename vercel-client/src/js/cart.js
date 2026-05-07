const CART_KEY = 'navino_cart';
const FAV_KEY  = 'navino_favorites';
const CMP_KEY  = 'navino_compare';

export const getCart      = () => JSON.parse(localStorage.getItem(CART_KEY) || '[]');
export const getFavorites = () => JSON.parse(localStorage.getItem(FAV_KEY)  || '[]');
export const getCompare   = () => JSON.parse(localStorage.getItem(CMP_KEY)  || '[]');

export const addToCart = (product) => {
    const cart = getCart();
    const item = cart.find(i => i.id === product.id);
    if (item) {
        item.quantity = (item.quantity || 1) + 1;
    } else {
        cart.push({
            id:       product.id,
            title:    product.title,
            image:    product.image,
            price:    product.minPrice || 0,
            quantity: 1,
        });
    }
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    refreshBadges();
};

export const toggleFavorite = (product) => {
    const favs = getFavorites();
    const idx  = favs.findIndex(i => i.id === product.id);
    if (idx >= 0) favs.splice(idx, 1);
    else favs.push({ id: product.id, title: product.title, image: product.image });
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
    refreshBadges();
    return idx < 0; // true = added, false = removed
};

export const isFavorite = (id) => getFavorites().some(i => i.id === id);

export const toggleCompare = (product) => {
    const cmp = getCompare();
    const idx = cmp.findIndex(i => i.id === product.id);
    if (idx >= 0) {
        cmp.splice(idx, 1);
        localStorage.setItem(CMP_KEY, JSON.stringify(cmp));
        refreshBadges();
        return false; // removed
    }
    if (cmp.length >= 3) return null; // max 3 wines
    cmp.push({ id: product.id });
    localStorage.setItem(CMP_KEY, JSON.stringify(cmp));
    refreshBadges();
    return true; // added
};

export const removeFromCompare = (id) => {
    const cmp = getCompare().filter(i => i.id !== id);
    localStorage.setItem(CMP_KEY, JSON.stringify(cmp));
    refreshBadges();
};

export const isInCompare = (id) => getCompare().some(i => i.id === id);

export const refreshBadges = () => {
    const cartCount = getCart().reduce((s, i) => s + (i.quantity || 1), 0);
    const favCount  = getFavorites().length;
    const cmpCount  = getCompare().length;

    document.querySelectorAll('.cart-badge').forEach(el => {
        el.textContent = cartCount;
        el.classList.toggle('badge--hidden', cartCount === 0);
    });
    document.querySelectorAll('.fav-badge').forEach(el => {
        el.textContent = favCount;
        el.classList.toggle('badge--hidden', favCount === 0);
    });
    document.querySelectorAll('.cmp-badge').forEach(el => {
        el.textContent = cmpCount;
        el.classList.toggle('badge--hidden', cmpCount === 0);
    });
};
