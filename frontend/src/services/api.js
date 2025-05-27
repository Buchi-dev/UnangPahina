import axios from 'axios';

const API_URLS = {
    BOOKS: 'http://localhost:3008/api',
    USERS: 'http://localhost:3002/api',  // Updated from 3001 to 3002 to match the actual port
    CART: 'http://localhost:3003/api',
    ORDERS: 'http://localhost:3004/api'
};

// Create axios instances for each service
const createAxiosInstance = (baseURL) => {
    const instance = axios.create({ 
        baseURL,
        timeout: 5000 // Add a reasonable timeout
    });
    
    // Add request interceptor for authentication
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
    
    // Add response interceptor for error handling
    instance.interceptors.response.use(
        (response) => response,
        (error) => {
            // Handle connection errors with a more user-friendly message
            if (!error.response) {
                console.error(`Connection error to ${baseURL}: ${error.message}`);
                return Promise.reject({
                    response: {
                        data: { message: `Could not connect to the service. Please make sure the ${baseURL.split('://')[1].split(':')[1]} microservice is running.` }
                    }
                });
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

// API instances
export const booksApi = createAxiosInstance(API_URLS.BOOKS);
export const usersApi = createAxiosInstance(API_URLS.USERS);
export const cartApi = createAxiosInstance(API_URLS.CART);
export const ordersApi = createAxiosInstance(API_URLS.ORDERS);

// Auth services
export const authService = {
    login: (credentials) => usersApi.post('/users/login', credentials),
    register: (userData) => usersApi.post('/users/register', userData),
    getProfile: () => usersApi.get('/users/me')
};

// Books services
export const bookService = {
    getAllBooks: () => booksApi.get('/books'),
    getBook: (id) => booksApi.get(`/books/${id}`),
    searchBooks: (query) => booksApi.get(`/books/search?q=${query}`)
};

// Cart services
export const cartService = {
    getCart: (userId) => cartApi.get(`/cart/${userId}`),
    addToCart: (userId, item) => cartApi.post(`/cart/${userId}/items`, item),
    updateQuantity: (userId, bookId, quantity) => 
        cartApi.put(`/cart/${userId}/items/${bookId}`, { quantity }),
    removeFromCart: (userId, bookId) => 
        cartApi.delete(`/cart/${userId}/items/${bookId}`),
    checkout: (userId) => cartApi.post(`/cart/${userId}/checkout`)
};

// Order services
export const orderService = {
    getUserOrders: (userId) => ordersApi.get(`/orders/user/${userId}`),
    getOrder: (id) => ordersApi.get(`/orders/${id}`)
}; 