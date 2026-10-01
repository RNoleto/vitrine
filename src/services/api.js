import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('firebaseToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Sanitiza URLs de imagens em respostas para evitar erro de Mixed Content HTTP em páginas HTTPS
function sanitizeUrls(obj) {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
        return obj.map(sanitizeUrls);
    }

    const sanitized = { ...obj };
    for (const key in sanitized) {
        if (typeof sanitized[key] === 'string') {
            // Se a página estiver rodando em HTTPS e a URL for HTTP
            if (window.location.protocol === 'https:' && sanitized[key].startsWith('http://')) {
                // Se for URL de storage local (ex: http://127.0.0.1:8000/storage/...)
                if (sanitized[key].includes('/storage/')) {
                    const baseUrl = (import.meta.env.VITE_API_BASE_URL || window.location.origin).replace(/\/api\/?$/, '');
                    const cleanBase = baseUrl.startsWith('http://') ? baseUrl.replace('http://', 'https://') : baseUrl;
                    sanitized[key] = sanitized[key].replace(/^http:\/\/[^\/]+/, cleanBase);
                } else {
                    sanitized[key] = sanitized[key].replace('http://', 'https://');
                }
            }
        } else if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
            sanitized[key] = sanitizeUrls(sanitized[key]);
        }
    }
    return sanitized;
}

api.interceptors.response.use(response => {
    if (response.data && window.location.protocol === 'https:') {
        response.data = sanitizeUrls(response.data);
    }
    return response;
});

export default api