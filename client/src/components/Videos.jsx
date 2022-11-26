import InfiniteScroll from "react-infinite-scroll-component";
import useSearchQuery from "./hooks/useSearchQuery";

import useVideos from "./hooks/useVideos";
import YouTubeCard from "./YouTubeCard";

export default function Videos() {
  const query = useSearchQuery();
  const [videos, isLoading, error, hasMore, fetchMoreVideos] = useVideos();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  if (videos.length === 0) {
    if (query) {
      return (
        <div className="text-lg">
          <p>No results found</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-lg">
          <p>Looks like there are no videos at the moment.</p>
          <p>Please wait for a while (10-20 seconds) and click refresh.</p>
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
    <InfiniteScroll
      dataLength={videos.length}
      hasMore={hasMore}
      next={fetchMoreVideos}
      className="space-y-4 md:space-y-6"
      loader={<></>}
      endMessage={
        <div className="pt-8 flex items-center flex-col justify-center">
          <p className="text-lg">You've made it to the end</p>
          <button
            className="bg-fam-yellow-light text-fam-black-dark px-6 py-2 rounded-full font-medium mt-4"
            onClick={() =>
              setTimeout(() => {
                // eslint-disable-next-line no-self-assign
                window.location.href = window.location.href;
              })
            }
          >
            Refresh to fetch latest scraped videos
          </button>
        </div>
      }
    >
      <div className="flex flex-wrap gap-8">
        {videos.map((video) => {
          return <YouTubeCard {...video} key={video._id} />;
        })}
      </div>
    </InfiniteScroll>
  );
}
