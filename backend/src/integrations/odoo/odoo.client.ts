import axios from "axios";
import { env } from "../../config/env";

export async function odooStatus() {
  if (!env.odooUrl || (!env.odooApiKey && !env.odooPassword)) return { connected: false, reason: "Odoo credentials are not configured", mode: env.odooMode, version: null };
  try {
    const response = await axios.get(`${env.odooUrl.replace(/\/$/, "")}/web/webclient/version_info`, { timeout: 5000 });
    return { connected: true, reason: null, mode: env.odooMode, version: response.data?.server_version || env.odooVersion };
  } catch (error) {
    return { connected: false, reason: error instanceof Error ? error.message : "Odoo connection failed", mode: env.odooMode, version: null };
  }
}
