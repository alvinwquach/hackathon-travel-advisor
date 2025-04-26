import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Your AI Travel Companion
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Plan your perfect trip with personalized recommendations, real-time updates, and smart booking assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Cards */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-700">
            <div className="text-blue-400 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Personalized Planning</h3>
            <p className="text-gray-400">
              Get a custom itinerary based on your preferences, budget, and travel style.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-700">
            <div className="text-blue-400 text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-white">AI-Powered Assistance</h3>
            <p className="text-gray-400">
              Our AI travel agent helps you make the best choices for your journey.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-700">
            <div className="text-blue-400 text-4xl mb-4">💼</div>
            <h3 className="text-xl font-semibold mb-2 text-white">Smart Bookings</h3>
            <p className="text-gray-400">
              Find the best deals and make reservations with just a few clicks.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <Link 
            href="/plan-trip"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
          >
            Start Planning Your Trip
          </Link>
        </div>
      </div>
    </main>
  );
}
