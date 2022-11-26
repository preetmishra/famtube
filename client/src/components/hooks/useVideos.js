import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import useSearchQuery from "./useSearchQuery";

const LIMIT = 10;
const API = `${process.env.REACT_APP_API}/videos`;

export default function useVideos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const query = useSearchQuery();

  const pageNumber = useRef(0);
  const videoIds = useRef(new Set());

  const isInitialMount = useRef(true);

  const fetchMoreVideos = useCallback(() => {
    axios
      .get(API, {
        params: {
          pageLimit: LIMIT,
          pageNumber: pageNumber.current,
          ...(query && { query }),
        },
      })
      .then((response) => {
        const data = response.data?.data || [];

        setHasMore(data.length !== 0);

        pageNumber.current += 1;

        setVideos((state) => {
          const prev = state ? [...state] : [];
          const next = [];

          for (const item of data) {
            const _id = item._id;

            if (videoIds.current.has(_id)) {
              continue;
            }

            videoIds.current.add(_id);
            next.push(item);
          }

          return prev.concat(next);
        });
      })
      .catch((error) => {
        console.error("Something went wrong");
        console.error(error);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  // Only fetch the posts from here the first time.
  useEffect(() => {
    if (isInitialMount.current) {
      fetchMoreVideos();
    }
  }, [fetchMoreVideos]);

  // Effect to monitor initial mount.
  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
  }, []);

  return [videos, isLoading, error, hasMore, fetchMoreVideos];
}
