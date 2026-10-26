import type { APIRoute } from 'astro';
import { site } from '../data/site.mjs';

export const prerender = true;

const xmlEntities: Record<string, string> = {
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
};
const escapeXml = (value: string) => value.replace(/[<>&"']/g, character => xmlEntities[character]);

// This LP has one canonical page. Section anchors are not separate pages.
export const GET: APIRoute = () => new Response(
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeXml(site.url)}</loc></url>\n</urlset>\n`,
  { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
);
