import { locales } from '@/lib/i18n';

// Generate static params for all locales
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// This layout wraps all localized pages
export default function LangLayout({ children, params }) {
  return children;
}
