import { motion } from "framer-motion";

const Home = () => {
  const pages = [
    { title: "Fixtures", description: "Check upcoming football matches", path: "/fixtures.html" },
    { title: "Live Scores", description: "Follow live match updates", path: "/live-scores.html" },
    { title: "Standings", description: "View current league rankings", path: "/standings.html" },
    { title: "Teams", description: "Explore clubs and details", path: "/teams.html" },
    { title: "Players", description: "Top players and stats", path: "/players.html" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12 md:px-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
          Welcome to Football Central ⚽
        </h1>
        <p className="text-gray-600 text-lg">
          Your all-in-one dashboard for matches, teams, players, and live stats.
        </p>
      </motion.div>

      {/* Grid Navigation */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page, index) => (
          <motion.div
            key={page.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border"
          >
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              {page.title}
            </h2>
            <p className="text-gray-600 mb-4">{page.description}</p>
            <a
              href={page.path}
              className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Go to {page.title}
            </a>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center text-sm text-gray-500"
      >
        © {new Date().getFullYear()} Football Central. Built with ❤️ using React & Tailwind.
      </motion.div>
    </div>
  );
};

export default Home;
