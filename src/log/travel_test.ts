import { assertEquals } from "$std/assert/mod.ts";
import { inject } from "cliffy";
import { Entry } from "../schemas.ts";
import { logTrip } from "./travel.ts";

Deno.test("Log a trip", async () => {
  inject({
    country: "Pangea",
    countryEmoji: "🌍",
    cities: "Africa, South America",
    departure: "0001-01-01",
    arrival: "2023-01-28",
    occasion: "pleasure",
    title: "Travel through time",
  });

  const entry = await logTrip();

  const expected: Entry = {
    title: "Travel through time",
    type: "travel",
    date: "0001-01-01",
    to_date: "2023-01-28",
    location: {
      cities: ["Africa", "South America"],
      country: {
        name: "Pangea",
        emoji: "🌍",
      },
    },
    occasion: "pleasure",
  };

  assertEquals(entry, expected);
});
