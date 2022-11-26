import Videos from "./Videos";
import Search from "./Search";
import SearchNotification from "./SearchNotification";

const Welcome = () => {
  return (
    <h1 className="text-5xl font-bold">
      Say hello to{" "}
      <span className="text-fam-yellow-light">
        FamTube <span className="animate-wave inline-block">👋</span>
      </span>
    </h1>
  );
};

export default function Home() {
  return (
    <div className="pt-8 pb-20 px-8 md:pt-16 md:pb-24 md:px-16 space-y-24">
      <Welcome />
      <div className="space-y-8">
        <div className="space-y-4">
          <SearchNotification />
          <Search />
        </div>
        <Videos />
      </div>
    </div>
  );
}
