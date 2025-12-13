const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Skill-Match API Documentation",
            version: "1.0.0",
            description: "API documentation for Skill-Match application",
            contact: {
                name: "API Support",
                email: "support@skillmatch.com",
            },
        },
        servers: [
            {
                url: "http://localhost:5000/api",
                description: "Local Development Server",
            },
            {
                url: "http://localhost:3000/api",
                description: "Alternative Local Server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        skills: {
                            type: "array",
                            items: { type: "string" }
                        }
                    }
                },
                Job: {
                    type: "object",
                    properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        skills: {
                            type: "array",
                            items: { type: "string" }
                        },
                        createdBy: { type: "string" }
                    }
                },
                Skill: {
                    type: "object",
                    properties: {
                        name: { type: "string" }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/api/*.js"], // Files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
