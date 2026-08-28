import { describe, it, expect } from "vitest";
import {
  FetchMovieDeepDiveSchema,
  CompareFilmsSchema,
  QuickAddToWatchlistSchema,
  executeFetchMovieDeepDive,
  executeCompareFilms,
} from "../tools";

describe("FE-07 AI Tools & Zod Schema Validation Suite", () => {
  describe("Zod Schema Contracts", () => {
    it("should validate valid FetchMovieDeepDive input and apply defaults", () => {
      const parsed = FetchMovieDeepDiveSchema.parse({ movieTitle: "Inception" });
      expect(parsed.movieTitle).toBe("Inception");
      expect(parsed.detailType).toBe("full");
    });

    it("should reject FetchMovieDeepDive input with missing movieTitle", () => {
      expect(() => FetchMovieDeepDiveSchema.parse({})).toThrow();
    });

    it("should validate valid CompareFilms input", () => {
      const parsed = CompareFilmsSchema.parse({ filmA: "Inception", filmB: "Interstellar" });
      expect(parsed.filmA).toBe("Inception");
      expect(parsed.filmB).toBe("Interstellar");
    });

    it("should reject CompareFilms with missing filmB", () => {
      expect(() => CompareFilmsSchema.parse({ filmA: "Inception" })).toThrow();
    });

    it("should validate QuickAddToWatchlist input", () => {
      const parsed = QuickAddToWatchlistSchema.parse({
        movieId: 101,
        movieTitle: "Interstellar",
        reason: "Epic sci-fi masterpiece.",
      });
      expect(parsed.movieId).toBe(101);
      expect(parsed.movieTitle).toBe("Interstellar");
    });
  });

  describe("Tool Execution Functions", () => {
    it("should execute fetchMovieDeepDive and return structured film telemetry", async () => {
      const result = await executeFetchMovieDeepDive({ movieTitle: "Inception", detailType: "full" });

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("visualStyle");
      expect(result).toHaveProperty("pacingScore");
      expect(result.pacingScore).toBeGreaterThanOrEqual(0);
      expect(result.pacingScore).toBeLessThanOrEqual(100);
      expect(result).toHaveProperty("thematicDepthScore");
      expect(result).toHaveProperty("rewatchabilityScore");
      expect(result.boxOffice).toHaveProperty("worldwideGross");
      expect(Array.isArray(result.keyThemes)).toBe(true);
    });

    it("should execute compareFilms and return comparative metrics", async () => {
      const result = await executeCompareFilms({
        filmA: "Inception",
        filmB: "Interstellar",
      });

      expect(result.filmA.title).toBeTruthy();
      expect(result.filmB.title).toBeTruthy();
      expect(result.filmA.visualSpectacle).toBeGreaterThan(0);
      expect(result.filmB.visualSpectacle).toBeGreaterThan(0);
      expect(result.verdict).toContain("offers");
      expect(result.recommendedFor).toHaveProperty("filmA");
      expect(result.recommendedFor).toHaveProperty("filmB");
    });
  });
});
