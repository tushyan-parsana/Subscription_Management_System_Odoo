import "dotenv/config";

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] || fallback;
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

export const env = {
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  jwtSecret: required("JWT_SECRET", "development-only-change-me"),
  odooUrl: process.env.ODOO_URL,
  odooDb: process.env.ODOO_DB,
  odooVersion: process.env.ODOO_VERSION || "auto",
  odooApiKey: process.env.ODOO_API_KEY,
  odooUsername: process.env.ODOO_USERNAME,
  odooPassword: process.env.ODOO_PASSWORD,
  odooMode: process.env.ODOO_INTEGRATION_MODE || "auto",
};
