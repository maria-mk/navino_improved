// Shared filter state. Modules import this and listen to 'navino:filters-changed'.
export const state = {
    allProducts: [],
    priceCache:  {},
    ratingCache: {},
    filters: {
        search:   '',
        colors:   new Set(),
        sugars:   new Set(),
        types:    new Set(),
        priceMin: null,
        priceMax: null,
    },
};

const dispatch = () =>
    document.dispatchEvent(new CustomEvent('navino:filters-changed'));

export const setSearch = (value) => {
    state.filters.search = value.trim();
    dispatch();
};

export const setPriceRange = (min, max) => {
    state.filters.priceMin = min !== '' && min !== null ? Number(min) : null;
    state.filters.priceMax = max !== '' && max !== null ? Number(max) : null;
    dispatch();
};

const toggle = (set, value) => {
    if (set.has(value)) set.delete(value);
    else set.add(value);
};

export const toggleColor = (value) => { toggle(state.filters.colors, value); dispatch(); };
export const toggleSugar = (value) => { toggle(state.filters.sugars, value); dispatch(); };
export const toggleType  = (value) => { toggle(state.filters.types,  value); dispatch(); };

export const getFiltered = () => {
    const { search, colors, sugars, types, priceMin, priceMax } = state.filters;
    return state.allProducts.filter(p => {
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        if (colors.size && !colors.has(p.color)) return false;
        if (sugars.size && !sugars.has(p.sugar)) return false;
        if (types.size  && !types.has(p.type))   return false;
        if (priceMin !== null || priceMax !== null) {
            const prices = state.priceCache[p.id];
            if (prices?.length) {
                const min = Math.min(...prices.map(x => x.price));
                if (priceMin !== null && min < priceMin) return false;
                if (priceMax !== null && min > priceMax) return false;
            }
        }
        return true;
    });
};
