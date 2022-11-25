import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";

const LIMIT = 10;
const API = `${process.env.REACT_APP_API}/videos`;

export default function useVideos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const pageNumber = useRef(0);

  const isInitialMount = useRef(true);

  const fetchMoreVideos = useCallback(() => {
    axios
      .get(API, {
        params: {
          pageLimit: LIMIT,
          pageNumber: pageNumber.current,
        },
      })
      .then((response) => {
        const data = response.data?.data || [];

        setHasMore(data.length !== 0);

        pageNumber.current += 1;

        setVideos((state) => {
          const prev = state ? [...state] : [];
          return prev.concat(data);
        });
      })
      .catch((error) => {
        console.error("Something went wrong");
        console.error(error);
        setError(error);
      })
      .finally(() => setIsLoading(false));
  }, []);

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
