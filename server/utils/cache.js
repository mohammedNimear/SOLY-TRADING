import NodeCache from 'node-cache';

// إنشاء كائن التخزين المؤقت
const cache = new NodeCache({ 
    stdTTL: 600, // 10 دقائق افتراضياً
    checkperiod: 120 
});

// دوال مساعدة للتخزين المؤقت
export const setCache = (key, value, ttl = 600) => {
    return cache.set(key, value, ttl);
};

export const getCache = (key) => {
    return cache.get(key);
};

export const deleteCache = (key) => {
    return cache.del(key);
};

export const flushCache = () => {
    return cache.flushAll();
};

// دالة middleware للاستخدام في الروتز
export const cacheMiddleware = (ttl = 600) => {
    return (req, res, next) => {
        const key = req.originalUrl || req.url;
        const cachedResponse = getCache(key);
        
        if (cachedResponse) {
            return res.status(200).json(cachedResponse);
        }
        
        // تعديل دالة send لحفظ الاستجابة في التخزين المؤقت
        const originalSend = res.send;
        res.send = function(data) {
            setCache(key, JSON.parse(data), ttl);
            originalSend.call(this, data);
        };
        
        next();
    };
};
