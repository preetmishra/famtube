import { DateTime } from "luxon";

const PlayIcon = ({ className = " " }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
      clipRule="evenodd"
    />
  </svg>
);

function getThumbnail(thumbnails) {
  if ("high" in thumbnails) {
    return thumbnails.high;
  }

  if ("medium" in thumbnails) {
    return thumbnails.medium;
  }

  if ("default" in thumbnails) {
    return thumbnails.default;
  }

  return "";
}

export default function YouTubeCard({
  title,
  thumbnails,
  description,
  videoId,
  publishedAt,
}) {
  return (
    <div className="w-[100%] md:w-[40%] lg:w-[30%] px-4 bg-fam-black-mid py-6 rounded-2xl space-y-6 break-all">
      <div
        className="w-full h-40 relative cursor-pointer"
        onClick={() => {
          window.open(`https://youtube.com/watch?v=${videoId}`, "_blank");
        }}
      >
        <img
          className="w-full h-full object-cover rounded-xl"
          src={getThumbnail(thumbnails)}
          alt={title}
        />
        <div className="absolute inset-0 bg-fam-black-dark bg-opacity-50 rounded-xl" />
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="bg-fam-black-dark p-2 rounded-full bg-opacity-75 backdrop-blur-xl backdrop-filter">
            <PlayIcon className="w-8 h-8 ml-0.5 text-gray-300" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-fam-black-light text-sm">
          {DateTime.fromISO(publishedAt).toFormat("DDDD • hh:mm a")}
        </p>
        <div className="space-y-2">
          <p className="text-lg font-medium text-fam-yellow-light">{title}</p>
          <p className="text-fam-yellow-mid">{description}</p>
        </div>
      </div>
    </div>
  );
}
