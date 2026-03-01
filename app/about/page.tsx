"use client";

import Navbar from "@/components/Navbar";
import Image from "next/image";

<div className="w-full md:w-1/3">
  <Image
    src="/images/pandit-manoj.jpg"
    alt="Pandit Manoj Kumar Mishra"
    width={400}
    height={400}
    className="rounded-3xl shadow-2xl object-cover w-full"
  />
</div>

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start gap-12">
          {/* Image */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            <img
              src="/images/manoj-about.jpg"
              alt="Pandit Manoj Kumar Mishra"
              className="rounded-3xl shadow-2xl w-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="md:w-2/3 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
              About Pandit Manoj Kumar Mishra
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed">
              Pandit Manoj Kumar Mishra is a well-known astrologer based in Bhagalpur, Bihar. With a strong academic foundation and decades of spiritual practice, he has guided countless individuals through astrology, gemstones, and traditional rituals.
            </p>

            {/* Section blocks */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Background & Journey</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Completed M.Sc. in Chemistry from Bhupendra Narayan Mandal University.</li>
                  <li>Taught chemistry to children for about 4 years.</li>
                  <li>Studied Astrology at Darbhanga Sanskrit University, completed in 2000.</li>
                  <li>Providing astrology services in Bhagalpur since 2000.</li>
                  <li>Priest of Bhagalpur's famous Harbariya Kali Mandir.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Astrology Services Offered</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Kundli (Janam Patri)</li>
                  <li>Palmistry (Palm Reading)</li>
                  <li>Lucky Gemstones</li>
                  <li>Vastu Shastra</li>
                  <li>Panchang Predictions</li>
                  <li>Career Report</li>
                  <li>Marriage Prediction</li>
                  <li>Phone Consultation</li>
                  <li>Match Making</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Gemstones Available</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Ruby (माणिक्य)</li>
                  <li>Pearl (मोती)</li>
                  <li>Coral (मूंगा)</li>
                  <li>Emerald (पन्ना)</li>
                  <li>Jade (मरगज)</li>
                  <li>Yellow Sapphire (पुखराज)</li>
                  <li>Zircon (जरकन)</li>
                  <li>Diamond (हीरा)</li>
                  <li>Blue Sapphire (नीलम)</li>
                  <li>Iolite (नीली)</li>
                  <li>Amethyst (जमुनिया)</li>
                  <li>Hessonite (गोमेद)</li>
                  <li>Cat's Eye (लहसुनिया)</li>
                  <li>Navaratna (नवरत्न)</li>
                  <li>Moonstone (चंद्रकांत)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Puja Services</h2>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Marriage Ceremonies</li>
                  <li>Home Entry (Griha Pravesh) Puja</li>
                  <li>Funeral Ceremonies</li>
                  <li>Other Traditional Rituals</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Contact Information</h2>
                <p className="text-gray-300">
                  📞 Phone: (+91) 9431001096, (+91) 7004992838 <br />
                  📧 Email: <a href="mailto:manoj6005@gmail.com" className="underline hover:text-yellow-400">manoj6005@gmail.com</a> <br />
                  📍 Address: Harbariya Kali Mandir, Mandroja, Bhagalpur – 812002, Bihar, India
                </p>
              </div>
            </div>

            <button className="mt-6 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
              Book Consultation
            </button>
          </div>
        </div>
      </main>
    </>
  );
}