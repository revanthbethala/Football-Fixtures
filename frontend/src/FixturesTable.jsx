import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

const FixturesGrid = () => {
  const [allFixtures, setAllFixtures] = useState([]);
  const [filteredFixtures, setFilteredFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  useEffect(() => {
    const fetchFixtures = async () => {
      try {
        const response = await axios.get(`${backendUrl}/fixtures`);
        const reversed = response.data.reverse().slice(0, 70);
        setAllFixtures(reversed);
        setFilteredFixtures(reversed);
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFixtures();
  }, []);

  useEffect(() => {
    let filtered = [...allFixtures];

    if (selectedLeague) {
      filtered = filtered.filter(
        (f) => f.league.toLowerCase() === selectedLeague.toLowerCase()
      );
    }

    if (selectedCountry) {
      filtered = filtered.filter(
        (f) => f.country.toLowerCase() === selectedCountry.toLowerCase()
      );
    }

    if (showLiveOnly) {
      filtered = filtered.filter((f) => f.eventLive === "1");
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.league.toLowerCase().includes(term) ||
          f.homeTeam.toLowerCase().includes(term) ||
          f.awayTeam.toLowerCase().includes(term)
      );
    }

    setFilteredFixtures(filtered);
  }, [searchTerm, selectedLeague, selectedCountry, showLiveOnly, allFixtures]);

  const leagues = Array.from(new Set(allFixtures.map((f) => f.league))).sort();
  const countries = Array.from(
    new Set(allFixtures.map((f) => f.country))
  ).sort();

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLeague("");
    setSelectedCountry("");
    setShowLiveOnly(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-slate-700">
            Loading fixtures...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ⚽ Football Fixtures
            </h1>
            <p className="text-slate-600 mt-1">
              {filteredFixtures.length} fixtures found
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search teams or leagues..."
                className="w-full px-4 py-3 pl-10 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
            >
              <option value="">All Leagues</option>
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>

            <select
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">All Countries</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <div className="flex items-center justify-center">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showLiveOnly}
                    onChange={(e) => setShowLiveOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-6 rounded-full transition-all ${
                      showLiveOnly ? "bg-red-500" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                        showLiveOnly ? "translate-x-6" : "translate-x-0.5"
                      } mt-0.5`}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Live Only
                </span>
              </label>
            </div>
          </div>

          {(searchTerm ||
            selectedLeague ||
            selectedCountry ||
            showLiveOnly) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all"
            >
              Clear Filters
            </motion.button>
          )}
        </motion.div>

        {/* Fixtures Grid */}
        <AnimatePresence mode="wait">
          {filteredFixtures.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">⚽</div>
              <p className="text-xl text-slate-600 mb-2">No fixtures found</p>
              <p className="text-slate-500">Try adjusting your filters</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredFixtures.map((fixture, index) => (
                <motion.div
                  key={fixture.eventId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group p-6"
                >
                  {/* Live indicator */}
                  {fixture.eventLive === "1" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 z-10"
                    >
                      <div className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                          }}
                          className="w-2 h-2 bg-white rounded-full"
                        />
                        LIVE
                      </div>
                    </motion.div>
                  )}

                  {/* League Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={fixture.leagueLogo || "/placeholder.svg"}
                        alt={fixture.league}
                        className="w-6 h-6 rounded"
                      />
                      <span className="font-semibold text-slate-800 text-sm">
                        {fixture.league}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <img
                        src={fixture.countryLogo || "/placeholder.svg"}
                        alt={fixture.country}
                        className="w-5 h-5 rounded-sm"
                      />
                      <span className="text-xs text-slate-600">
                        {fixture.country}
                      </span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between py-6 border-y border-slate-100">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <img
                        src={fixture.homeLogo || "/placeholder.svg"}
                        alt={fixture.homeTeam}
                        className="w-12 h-12 rounded-full shadow-md"
                      />
                      <span className="font-medium text-center text-sm leading-tight">
                        {fixture.homeTeam}
                      </span>
                    </motion.div>

                    <div className="flex flex-col items-center px-4">
                      <span className="text-2xl font-bold text-slate-400">
                        VS
                      </span>
                      <span className="text-xs text-slate-500 mt-1">
                        {fixture.eventTime}
                      </span>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <img
                        src={fixture.awayLogo || "/placeholder.svg"}
                        alt={fixture.awayTeam}
                        className="w-12 h-12 rounded-full shadow-md"
                      />
                      <span className="font-medium text-center text-sm leading-tight">
                        {fixture.awayTeam}
                      </span>
                    </motion.div>
                  </div>

                  {/* Match Details */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>📅</span>
                      <span>{fixture.eventDate}</span>
                    </div>
                    {fixture.venue && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>🏟️</span>
                        <span className="truncate">{fixture.venue}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>🎯</span>
                      <span> {fixture.leagueRound || "-"}</span>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 rounded-2xl" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FixturesGrid;
