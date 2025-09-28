import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from './index';

const { port } = config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AquaCare API',
      version: '1.0.0',
      description: 'API documentation for AquaCare application - Dictionary and Authentication services',
      contact: {
        name: 'API Support',
        email: 'support@aquacare.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            id: {
              type: 'string',
              description: 'User unique identifier'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              description: 'User password (hashed)'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            }
          }
        },
        Dictionary: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Dictionary unique identifier'
            },
            name: {
              type: 'string',
              description: 'Dictionary name'
            },
            language: {
              type: 'string',
              description: 'Dictionary language code'
            },
            entries: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/DictionaryEntry'
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        DictionaryEntry: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Entry unique identifier'
            },
            key: {
              type: 'string',
              description: 'Dictionary key'
            },
            value: {
              type: 'string',
              description: 'Dictionary value'
            },
            description: {
              type: 'string',
              description: 'Optional description'
            },
            category: {
              type: 'string',
              description: 'Optional category'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              description: 'Success message'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.ts', './controllers/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs }; 