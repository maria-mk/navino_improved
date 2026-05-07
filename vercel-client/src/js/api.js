const API_URL = 'http://localhost:3000/api/v1';

export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const getProductById = async (id) => {
    console.log('getProductById вызван с id:', id);
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const getStoreById = async (id) => {
    console.log('getStoreById вызван с id:', id);
    const response = await fetch(`${API_URL}/stores/${id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const getPriceByProductId = async (id) => {
    console.log('getPriceByProductId вызван с id:', id);
    const response = await fetch(`${API_URL}/prices/${id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};

export const getReviewsByProductId = async (id) => {
    console.log('getReviewsByProductId вызван с id:', id);  // Проверка на вызов метода

    const response = await fetch(`${API_URL}/reviews/${id}`);
    console.log('Response от API:', response);  // Проверка ответа от сервера

    const data = await response.json();
    console.log('Полученные данные с сервера:', data);  // Проверка данных с сервера

    if (!response.ok) {
        console.error('Ошибка ответа от сервера:', data);
        throw new Error(data);
    }

    return data;
};

export const createReview = async (gift) => {
    const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        body: JSON.stringify(gift),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data);
    }

    return data;
};
