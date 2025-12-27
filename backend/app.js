const express = require("express");
const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/api/auth.routes"));
app.use("/api/users", require("./routes/api/user.routes"));
app.use("/api/jobs", require("./routes/api/jobs.routes"));
app.use("/api/skills", require("./routes/api/skills.routes"));
app.use("/api/matching", require("./routes/api/matching.routes"));

const openapi = {
  openapi: "3.0.0",
  info: {
    title: "Skill-Match API",
    version: "1.0.0",
    description: "API documentation for Skill-Match",
    contact: { name: "API Support", url: "http://localhost:5000" },
    license: { name: "MIT" }
  },
  servers: [{ url: "http://localhost:5000" }],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Users", description: "User management" },
    { name: "Skills", description: "Skill management" },
    { name: "Jobs", description: "Job management" },
    { name: "Matching", description: "Job matching based on skills" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      Skill: {
        type: "object",
        properties: {
          id: { type: "string", example: "64f1ab2345..." },
          name: { type: "string", example: "Node.js" }
        },
        required: ["id", "name"]
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "64f1ab2345..." },
          name: { type: "string", example: "Mohamed" },
          email: { type: "string", example: "user@example.com" },
          skills: { type: "array", items: { type: "string" } }
        },
        required: ["id", "name", "email"]
      },
      Job: {
        type: "object",
        properties: {
          id: { type: "string", example: "64f1ab2345..." },
          title: { type: "string", example: "Backend Developer" },
          description: { type: "string", example: "We need a Node.js expert" },
          skills: { type: "array", items: { type: "string" } },
          createdBy: { type: "string", example: "64f1ab2345..." },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "title", "description", "skills"]
      },
      JobMatch: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          skills: { type: "array", items: { $ref: "#/components/schemas/Skill" } },
          matchedSkills: { type: "array", items: { $ref: "#/components/schemas/Skill" } },
          matchPercentage: { type: "integer", example: 80 }
        }
      },
      ErrorResponse: {
        type: "object",
        properties: { msg: { type: "string" } }
      },
      AuthToken: {
        type: "object",
        properties: { token: { type: "string" } }
      }
    }
  },
  security: [{ bearerAuth: [] }],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" }
                },
                required: ["name", "email", "password"]
              }
            }
          }
        },
        responses: {
          "201": {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    msg: { type: "string" },
                    user: { $ref: "#/components/schemas/User" }
                  }
                }
              }
            }
          },
          "400": {
            description: "User already exists",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { email: { type: "string" }, password: { type: "string" } },
                required: ["email", "password"]
              }
            }
          }
        },
        responses: {
          "200": { description: "Token", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthToken" } } } },
          "400": { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "User", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/users/skills": {
      put: {
        tags: ["Users"],
        summary: "Update user skills",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", properties: { skills: { type: "array", items: { type: "string" } } }, required: ["skills"] }
            }
          }
        },
        responses: {
          "200": { description: "Updated user", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/skills": {
      get: {
        tags: ["Skills"],
        summary: "Get all skills",
        responses: {
          "200": { description: "Skills", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Skill" } } } } }
        }
      },
      post: {
        tags: ["Skills"],
        summary: "Add a new skill",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] } } }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Skill" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/jobs": {
      get: {
        tags: ["Jobs"],
        summary: "Get all jobs",
        responses: {
          "200": { description: "Jobs", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Job" } } } } }
        }
      },
      post: {
        tags: ["Jobs"],
        summary: "Create a new job",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { title: { type: "string" }, description: { type: "string" }, skills: { type: "array", items: { type: "string" } } },
                required: ["title", "description", "skills"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Job" } } } },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/matching": {
      get: {
        tags: ["Matching"],
        summary: "Get matching jobs for current user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Matches",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    count: { type: "integer" },
                    jobs: { type: "array", items: { $ref: "#/components/schemas/JobMatch" } }
                  }
                }
              }
            }
          },
          "401": { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    }
  }
};

app.get("/openapi.json", (req, res) => {
  res.json(openapi);
});

app.get("/vendor/redoc.standalone.js", async (req, res) => {
  const sources = [
    "https://cdn.jsdelivr.net/npm/redoc@2.1.5/bundles/redoc.standalone.js",
    "https://unpkg.com/redoc@2.1.5/bundles/redoc.standalone.js",
    "https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js",
    "https://unpkg.com/redoc@next/bundles/redoc.standalone.js"
  ];
  for (const url of sources) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) continue;
      const code = await resp.text();
      if (code && code.includes("Redoc")) {
        res.type("application/javascript").send(code);
        return;
      }
    } catch {}
  }
  res.type("application/javascript").send("console.error('Failed to load Redoc script'); window.Redoc = undefined;");
});

app.get("/api-docs", (req, res) => {
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
    <style>
      :root {
        --bg: #ffffff;
        --panel: #f8fafc;
        --text: #333333;
        --muted: #64748b;
        --primary: #16a34a;
        --primary-contrast: #ffffff;
      }
      body { margin: 0; background: var(--bg); color: var(--text); }
      .swagger-ui { background: var(--bg); max-width: 1200px; margin: 0 auto; }
      .topbar-custom { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: #ffffff; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 10; }
      .brand { display: flex; align-items: center; gap: 8px; color: var(--text); font-weight: 600; }
      .brand .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 10px var(--primary); }
      .env { color: var(--muted); font-size: 12px; border: 1px solid #e2e8f0; padding: 2px 8px; border-radius: 999px; }
      .swagger-ui .opblock { background: var(--panel); border-color: #e2e8f0; }
      .swagger-ui .opblock .opblock-summary { background: var(--panel); color: var(--text); }
      .swagger-ui .opblock .opblock-summary-method { background: var(--primary); color: var(--primary-contrast); border-color: var(--primary); }
      .swagger-ui .responses-inner h4, .swagger-ui .model-title, .swagger-ui .info .title { color: var(--text); }
      .swagger-ui .btn { background: var(--primary); color: var(--primary-contrast); border-color: var(--primary); }
      .swagger-ui .btn:hover { filter: brightness(1.1); }
      .swagger-ui .scheme-container, .swagger-ui .models { background: var(--panel); color: var(--text); border-color: #e2e8f0; }
      .swagger-ui .info { color: var(--text); }
      .swagger-ui .markdown p, .swagger-ui .markdown h1, .swagger-ui .markdown h2, .swagger-ui .markdown h3 { color: var(--text); }
      .swagger-ui .response-col_status, .swagger-ui .response-col_description__inner, .responses-inner { color: var(--text); }
      .swagger-ui .opblock-tag { background: var(--panel); color: var(--text); border-color: #e2e8f0; }
      .swagger-ui .parameter__name, .swagger-ui .parameter__type { color: var(--text); }
      .swagger-ui .tab, .swagger-ui .tabitem { color: var(--text); }
      a, a:visited { color: var(--primary); }
    </style>
  </head>
  <body>
    <div class="topbar-custom">
      <div class="brand"><div class="dot"></div> Skill-Match API</div>
      <div class="env">Local Development</div>
    </div>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        docExpansion: 'none',
        defaultModelExpandDepth: 0,
        defaultModelsExpandDepth: -1,
        displayRequestDuration: true,
        tryItOutEnabled: true,
        persistAuthorization: true,
        layout: 'BaseLayout'
      });
    </script>
  </body>
</html>`);
});

app.get("/api-docs/", (req, res) => {
  res.redirect("/api-docs");
});

app.get("/redoc", (req, res) => {
  res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ReDoc</title>
    <style>
      body { margin: 0; background: #ffffff; color: #333333; }
    </style>
  </head>
  <body>
    <div id="redoc"></div>
    <script>
      (async () => {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = '/vendor/redoc.standalone.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
        Redoc.init('/openapi.json', {
          scrollYOffset: 0,
          theme: {
            colors: {
              primary: { main: '#16a34a' },
              text: { primary: '#333333', secondary: '#475569' },
              http: {
                get: '#2563eb',
                post: '#16a34a',
                put: '#d97706',
                delete: '#dc2626'
              }
            },
            typography: {
              fontSize: '14px',
              headings: { fontWeight: '600', color: '#1e293b' },
              code: { color: '#e11d48', backgroundColor: '#f1f5f9' },
              links: { color: '#16a34a' }
            },
            sidebar: {
              backgroundColor: '#f8fafc',
              textColor: '#334155',
              activeTextColor: '#16a34a'
            },
            rightPanel: { backgroundColor: '#1e293b', textColor: '#ffffff' },
            menu: { backgroundColor: '#f8fafc', textColor: '#334155' },
            logo: { maxHeight: '28px' }
          }
        }, document.getElementById('redoc'));
      })();
    </script>
  </body>
</html>`);
});

app.get("/redoc/", (req, res) => {
  res.redirect("/redoc");
});

app.get("/", (req, res) => {
  res.send("Skill-Match API is running...");
});

module.exports = app;
