import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Microsoft List API',
            version: '1.0.0',
            description: 'API documentation for the Microsoft List application',
        },
    },
    apis: ['./MicrosoftList/app.ts'], // Adjust paths to your controller files
};

const specs = swaggerJsdoc(options);

export default (app: Express) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
