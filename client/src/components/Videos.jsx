import axios from "axios";
import { useEffect, useState } from "react";

import YouTubeCard from "./YouTubeCard";

const API = `${process.env.REACT_APP_API}/videos`;

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(API)
      .then((res) => res.data)
      .then((payload) => {
        setVideos(payload);
      })
      .catch((err) => {
        console.error("Something went wrong");
        console.error(err);
        setError(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (videos.length === 0) {
    return (
      <div className="space-y-3">
        <div className="text-lg">
          <p>Looks like there are no videos at the moment.</p>
          <p>Please wait for a while (10 seconds) and click refresh.</p>
        </div>
        <button
          className="bg-fam-yellow-light text-fam-black-dark px-6 py-2 rounded-full font-medium -ml-0.5"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-8">
      {videos.map((video, index) => (
        <YouTubeCard {...video} key={video._id} />
      ))}
    </div>
  );
}
