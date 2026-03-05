import dotenv from 'dotenv';

dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 8800,
        env: process.env.NODE_ENV || 'development',
        baseUrl: process.env.BASE_URL || 'http://localhost:8800'
    },
    
    database: {
        uri: process.env.MONGO_URI,
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD
    },
    
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },
    
    cors: {
        origins: [
            'https://soly-trading.netlify.app',
            'http://localhost:3000'
        ]
    }
};
