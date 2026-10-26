/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL?: string;
	readonly PUBLIC_WHATSAPP_NUMBER?: string;
	readonly PUBLIC_CONTACT_EMAIL?: string;
	readonly PUBLIC_ANALYTICS_ENABLED?: string;
	readonly RESEND_API_KEY?: string;
	readonly CONTACT_TO_EMAIL?: string;
	readonly CONTACT_FROM_EMAIL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
