"use client";

import { motion } from "framer-motion";
import type { Genre } from "@/data/products";

export default function GenreFilter({
  genres,
  activeGenre,
  onSelect,
}: {
  genres: Genre[];
  activeGenre: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect("all")}
        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
          activeGenre === "all"
            ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-primary)]/25"
            : "bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 border border-white/10"
        }`}
      >
        🏠 すべて
      </motion.button>
      {genres.map((genre) => (
        <motion.button
          key={genre.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(genre.id)}
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            activeGenre === genre.id
              ? "text-white shadow-lg"
              : "bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 border border-white/10"
          }`}
          style={
            activeGenre === genre.id
              ? { background: genre.color, boxShadow: `0 4px 20px ${genre.color}40` }
              : {}
          }
        >
          {genre.icon} {genre.name}
        </motion.button>
      ))}
    </div>
  );
}
