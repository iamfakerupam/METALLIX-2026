import ScrollAdventure from "@/components/animated-scroll";

const DemoOne = () => {
  return (
    <div className="w-full min-h-screen bg-black py-16">
      {/* Title Section */}
      <div className="w-full text-center mb-8">
        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-wider">
          Events Scheduling
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 mt-4">
          Discover our exciting lineup
        </p>
      </div>

      {/* Animation Section */}
      <div className="w-full h-[calc(100vh-12rem)]">
        <ScrollAdventure />
      </div>
    </div>
  );
};

export { DemoOne };