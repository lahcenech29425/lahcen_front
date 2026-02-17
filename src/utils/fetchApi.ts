// Stub file - fetchApi removed, using direct fetch instead
export async function fetchApi(endpoint: string) {
    // This function is deprecated - use direct fetch or Sanity queries instead
    console.warn('fetchApi is deprecated');
    return null;
}

export async function fetchApiWithPagination(endpoint: string) {
    // This function is deprecated
    console.warn('fetchApiWithPagination is deprecated');
    return { data: [], meta: { pagination: { total: 0 } } };
}
