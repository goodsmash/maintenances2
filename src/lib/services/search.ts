import algoliasearch from 'algoliasearch';

const client = algoliasearch(
  import.meta.env.VITE_ALGOLIA_APP_ID!,
  import.meta.env.VITE_ALGOLIA_ADMIN_KEY!
);

export const searchIndex = client.initIndex('maintenance_records');

export const search = async (query: string) => {
  try {
    const { hits } = await searchIndex.search(query);
    return { success: true, results: hits };
  } catch (error) {
    console.error('Error searching:', error);
    return { success: false, error };
  }
};
