import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we are taking care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });

      const { skip, first } = args;

      // read the number of items on the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // if there are items
      // AND there aren't enough items to satisfy how many were requested
      // AND we are on the last page
      // THEN just send it

      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // we don't have any items, need to get them from the netowrk to fetch them
        return false;
      }

      // if there are items, then return them from teh cache, and we dont do a network call
      if (items.length) {
        console.log(
          `there are ${items.length} items in the cache - sending them to apollo`
        );
        return items;
      }
      return false; // fall back to network

      // first thing it does, it asks the read function items for those items
      // can do 1 or 2 things:
      // 1. return the items since they are in the cache already
      // 2. return false from here which means a network request will get called
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // this runs when the apollo client comes back from the networkmwith our products
      // how do you want to put them into the cache?

      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      // return the merged items from the cache. goes read, merge read
      return merged;
    },
  };
}
