/**
 * Get the full Strapi URL for a given path
 * @param path - The path to append to the Strapi URL (e.g., "/api/articles")
 * @returns The full URL
 */
export function getStrapiURL(path: string = ""): string {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${baseUrl}${path}`;
}

/**
 * Get the full URL for a Strapi media file
 * Handles both relative paths (/uploads/...) and full URLs (https://...)
 * @param url - The URL or path from Strapi
 * @returns The full media URL
 */
export function getStrapiMediaURL(url: string | null | undefined): string {
    if (!url) {
        return "";
    }

    // If URL is already absolute, return it
    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    // Otherwise, prepend the Strapi URL
    return getStrapiURL(url);
}
