import swaggerJSDoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShopFlow API',
            version: '1.0.0',
            description: 'API documentation for ShopFlow', 
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./src/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);