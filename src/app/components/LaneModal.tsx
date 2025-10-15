"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface LaneSeries {
  date: string;
  shipments: number;
  avg_cost_per_ton: number;
  avg_lead_days: number;
  on_time_rate: number;
}

interface Props {
  id: string | null;
  onClose: () => void;
}

export default function LaneModal({ id, onClose }: Props) {
  const [series, setSeries] = useState<LaneSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchSeries = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`/api/lanes/${id}/series`);
        if (res.status === 404) {
          setError("No time-series data available for this lane.");
          setSeries([]);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch series data.");
        const data = await res.json();
        setSeries(data);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
  }, [id]);

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-xl font-semibold mb-4 text-center">
              Lane ID: <span className="font-mono">{id}</span>
            </h2>

            {/* Loading / Error / Chart */}
            {loading && (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Loading series data…
              </p>
            )}

            {!loading && error && (
              <p className="text-center text-red-500 mt-6">{error}</p>
            )}

            {!loading && !error && series.length > 0 && (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={series}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                      }}
                      labelStyle={{ color: "#9ca3af" }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="avg_cost_per_ton"
                      name="Avg Cost / Ton"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="on_time_rate"
                      name="On-Time Rate"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
