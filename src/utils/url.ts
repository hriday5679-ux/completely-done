/**
 * URL Utilities for AI Studio Environment
 * 
 * In AI Studio, the development runner uses `ais-dev-*`, which is protected by
 * Cloud IAM / Identity-Aware Proxy and returns 403 Forbidden when accessed
 * directly in an external standalone browser tab.
 * 
 * The publicly accessible preview endpoint uses `ais-pre-*` (the Shared App URL),
 * which is accessible without internal container credentials.
 */

export function getPublicPreviewUrl(path?: string): string {
  if (typeof window === 'undefined') return '/';
  
  let href = window.location.href;
  
  // Replace internal development proxy subdomain with public shared preview subdomain
  if (href.includes('ais-dev-')) {
    href = href.replace('ais-dev-', 'ais-pre-');
  }
  
  if (path) {
    try {
      const url = new URL(href);
      url.pathname = path.startsWith('/') ? path : `/${path}`;
      return url.toString();
    } catch {
      // Fallback string replacement
      return href;
    }
  }
  
  return href;
}
