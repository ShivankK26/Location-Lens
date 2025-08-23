# Location Lens

A single-player geography guessing game built with Next.js, TypeScript, and MapLibre GL JS. Players are shown real-time images of famous locations around the world from Unsplash and must guess where they are by clicking on a world map.

## Features

- 🌍 **Interactive World Map**: Click anywhere on the map to make your location guess
- 🖼️ **Real-time Location Images**: Dynamic high-quality images from Unsplash API
- 📊 **Real-time Scoring**: Points based on distance accuracy
- 🎯 **Visual Results**: See your guess vs. actual location with connecting lines
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎮 **5 Rounds per Game**: Multiple locations to test your geography skills

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: MapLibre GL JS (free, open-source alternative to Mapbox)
- **Map Data**: OpenStreetMap tiles
- **Images**: Unsplash (free stock photos)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Unsplash API key (see [UNSPLASH_SETUP.md](UNSPLASH_SETUP.md))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd location-lens
```

2. Install dependencies:
```bash
npm install
```

3. Set up Unsplash API:
   - Follow the instructions in [UNSPLASH_SETUP.md](UNSPLASH_SETUP.md)
   - Create a `.env.local` file with your API key

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## How to Play

1. **Start the Game**: Click "Start Game" on the welcome screen
2. **View the Location**: Look at the image and description provided
3. **Make Your Guess**: Click anywhere on the world map to place your guess
4. **Confirm Your Guess**: Review the coordinates and confirm your selection
5. **See Results**: View how close your guess was to the actual location
6. **Continue**: Play through 5 rounds to complete the game
7. **Final Score**: See your total score and performance message

## Scoring System

- **Maximum Score per Round**: 5,000 points
- **Distance Calculation**: Uses Haversine formula for accurate distance measurement
- **Score Formula**: `maxScore * (1 - distance / 20000)`
- **Closer guesses = Higher scores**

## Game Locations

The game dynamically fetches real-time photos for 10 diverse locations:
- Paris, France (Eiffel Tower)
- Tokyo, Japan (Cityscape)
- New York, USA (Skyline)
- Sydney, Australia (Opera House)
- Cairo, Egypt (Pyramids)
- London, UK (Big Ben)
- Rio de Janeiro, Brazil (Christ the Redeemer)
- Moscow, Russia (Red Square)
- Cape Town, South Africa (Table Mountain)
- Bangkok, Thailand (Temples)

Each location uses specific search terms to fetch relevant, high-quality images from Unsplash.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── Game.tsx          # Main game logic and UI
│   │   ├── MapComponent.tsx  # Interactive map for guessing
│   │   └── ResultMap.tsx     # Results display with markers
│   ├── services/
│   │   └── unsplashApi.ts    # Unsplash API integration
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # App layout
│   └── page.tsx              # Main page
```

## Customization

### Adding New Locations

To add more locations, edit the `locationSearchTerms` array in `src/app/services/unsplashApi.ts`:

```typescript
{
  name: "Your City, Country",
  search: "your city country landmark",
  latitude: 0.0000,
  longitude: 0.0000
}
```

The search term should be descriptive to get relevant images from Unsplash.

### Changing Game Settings

- **Rounds**: Modify `totalRounds` in `Game.tsx`
- **Scoring**: Adjust the scoring formula in the `handleGuess` function
- **Map Style**: Customize map appearance in `MapComponent.tsx`

## Future Enhancements

- [ ] Street view integration (Mapillary API)
- [ ] More diverse location categories
- [ ] Multiplayer mode
- [ ] Leaderboards
- [ ] Custom map themes
- [ ] Difficulty levels
- [ ] Time limits per round

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [MapLibre GL JS](https://maplibre.org/) for the mapping library
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
- [Unsplash](https://unsplash.com/) for location images
- [Next.js](https://nextjs.org/) for the React framework
