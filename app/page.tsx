import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-screen flex items-center justify-center text-center px-6">

        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502082553048-f009c37129b9')] bg-cover bg-center opacity-20"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6">
            Manoj AI Astrology
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Discover your destiny through intelligent astrology.
            Get AI-powered horoscope insights, career guidance, and spiritual clarity.
          </p>

          <button className="bg-yellow-600 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg transition duration-300">
            Book Consultation
          </button>
        </div>

      </main>
    </>
  );
}