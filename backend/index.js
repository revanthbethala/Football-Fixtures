require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
app.use(cors())
const port = 3000;

const apiKey = process.env.FOOTBALL_API_KEY;
const base_url = "https://apiv2.allsportsapi.com/football";

const today = new Date();
const todayDate = today.toISOString().split("T")[0];
const inputDate = new Date(todayDate);
inputDate.setDate(inputDate.getDate() + 15);
const endDate = inputDate.toISOString().split("T")[0];

app.get("/fixtures", async (req, res) => {
  try {
    const response = await axios.get(
      `${base_url}/?met=Fixtures&from=${todayDate}&to=${endDate}&APIkey=${apiKey}`
    );
    const fixtures = response.data.result;

    if (!fixtures || fixtures.length === 0) {
      return res.json({ message: "No fixtures found in the given range." });
    }

    const simplifiedFixtures = fixtures.map((event) => ({
      eventId: event.event_key,
      eventDate: event.event_date,
      eventTime: event.event_time,
      homeTeam: event.event_home_team,
      awayTeam: event.event_away_team,
      homeTeamKey: event.home_team_key,
      awayTeamKey: event.away_team_key,
      venue: event.event_stadium,
      country: event.country_name,
      countryKey: event.event_country_key,
      league: event.league_name,
      leagueKey: event.league_key,
      leagueRound: event.league_round,
      leagueSeason: event.league_season,
      eventLive: event.event_live,
      homeLogo: event.home_team_logo,
      awayLogo: event.away_team_logo,
      leagueLogo: event.league_logo,
      countryLogo: event.country_logo
    }));

    res.json(simplifiedFixtures);
  } catch (error) {
    console.error("Error fetching fixtures:", error.message);
    res.status(500).json({ error: "Failed to fetch fixtures." });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
