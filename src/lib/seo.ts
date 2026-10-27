export function resolveSiteUrl(
  value?: string,
  productionHost?: string
): string {
  const url = new URL(
    value ||
      (productionHost ? `https://${productionHost}` : 'http://localhost:8888')
  );
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'NEXT_PUBLIC_APP_URL must be an http(s) origin without a path, query or credentials'
    );
  }
  return url.origin;
}

export function escapeXml(value: string): string {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[character]!
  );
}
