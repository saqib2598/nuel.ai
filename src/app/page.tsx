"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparklines, SparklinesLine } from "react-sparklines";
import LaneModal from "./components/LaneModal";
import ThemeToggle from "./components/ThemeToggle";

interface Lane {
  id: string;
  origin: string;
  destination: string;
  cost_per_ton: number;
  volume_tons: number;
  lead_days: number;
  reliability: number;
  mode: string;
}

export default function HomePage() {
  const [lanes, setLanes] = useState<Lane[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLane, setSelectedLane] = useState<string | null>(null);

  const fetchLanes = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `/api/lanes?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(
          destination
        )}`
      );
      if (!res.ok) throw new Error("Failed to fetch lanes");
      const data = await res.json();
      setLanes(data);
    } catch (err: any) {
      setError(err.message);
      setLanes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Floating Theme Toggle */}
      <ThemeToggle />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-4 text-center rounded-xl mb-8 shadow-md">
        Muhammad Saqib Ejaz — Frontend & Full-Stack Engineer
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">
        Network Flow Snapshot
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Filter by Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border rounded-md p-2 w-full md:w-1/4 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
        <input
          type="text"
          placeholder="Filter by Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="border rounded-md p-2 w-full md:w-1/4 dark:bg-gray-800 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
        />
        <button
          onClick={fetchLanes}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-all shadow-sm hover:shadow-lg"
        >
          {loading ? "Loading..." : "Apply Filters"}
        </button>
      </div>

      {/* Error / Empty States */}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      {!loading && lanes.length === 0 && !error && (
        <p className="text-center text-gray-500">No lanes found.</p>
      )}

      {/* Loading Skeletons */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="skeleton"
            className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-4 rounded-xl bg-gray-200 dark:bg-gray-700 h-40"
              >
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lanes Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {!loading &&
          lanes.map((lane, index) => (
            <motion.div
              key={lane.id}
              onClick={() => setSelectedLane(lane.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="p-4 rounded-xl border dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 border-white/20 backdrop-blur-md shadow-sm hover:shadow-xl transition-all cursor-pointer"
            >
              <h2 className="font-semibold text-lg mb-2">
                {lane.origin} → {lane.destination}
              </h2>
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Mode: <span className="font-medium">{lane.mode}</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Cost / Ton:{" "}
                  <span className="font-medium">${lane.cost_per_ton}</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Volume:{" "}
                  <span className="font-medium">
                    {lane.volume_tons.toLocaleString()} tons
                  </span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Lead Days:{" "}
                  <span className="font-medium">{lane.lead_days}</span>
                </motion.p>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Reliability:{" "}
                  <span className="font-medium">
                    {(lane.reliability * 100).toFixed(1)} %
                  </span>
                </motion.p>
              </div>

              {/* Sparkline preview */}
              <div className="mt-3">
                <Sparklines
                  data={[lane.cost_per_ton - 3, lane.cost_per_ton, lane.cost_per_ton + 1, lane.cost_per_ton - 1, lane.cost_per_ton + 2]}
                  limit={7}
                  width={100}
                  height={30}
                >
                  <SparklinesLine
                    color={lane.mode === "Truck" ? "#3b82f6" : "#f59e0b"}
                    style={{ strokeWidth: 2, fill: "none" }}
                  />
                </Sparklines>
              </div>
            </motion.div>
          ))}
      </div>

      {/* Drill-down modal */}
      <LaneModal id={selectedLane} onClose={() => setSelectedLane(null)} />
    </main>
  );
}
