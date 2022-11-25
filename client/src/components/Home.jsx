import Videos from "./Videos";

export default function Home() {
  return (
    <div className="pt-8 pb-20 px-8 md:pt-16 md:pb-24 md:px-16 space-y-24">
      <h1 className="text-5xl font-bold">
        Say hello to{" "}
        <span className="text-fam-yellow-light">
          FamTube <span className="animate-wave inline-block">👋</span>
        </span>
      </h1>
      <div>
        <Videos />
      </div>
    </div>
  );
}
