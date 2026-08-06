# TS-Memory Game

:video_game: A browser-based memory game built with TypeScript, Vite, and SCSS.

This project includes three pages:
- :house: Start page (Play CTA)
- :gear: Settings page (theme, players, board size)
- :joystick: Game page (gameplay, score, exit popup, end screens)

## :sparkles: Features

- :art: Two themes
  - Code vibes theme
  - Foods theme
- :triangular_ruler: Board sizes
  - 16 cards (4x4)
  - 24 cards (4x6)
  - 36 cards (6x6)
- :busts_in_silhouette: Player selection via checkboxes (up to 2 players)
- :game_die: Dynamic card generation based on selected theme and board size
- :arrows_counterclockwise: Match/mismatch logic with turn switching
- :bar_chart: Live score tracking per player
- :trophy: Game-over, winner, and draw modals
- :door: Exit confirmation popup on the game page
- :lipstick: Theme-specific visual styling

## :toolbox: Tech Stack

- TypeScript
- Vite
- Sass (SCSS)
- Vanilla DOM APIs

## :white_check_mark: Requirements

- Node.js 18+
- npm 9+

## :package: Installation

```bash
npm install
```

## :rocket: Development

```bash
npm run dev
```

Vite starts on the first free local port (usually 5173, otherwise the next available one).

## :hammer_and_wrench: Production Build

```bash
npm run build
```

Creates the production output in the dist folder.

## :mag: Preview Production Build

```bash
npm run preview
```

## :clipboard: Game Flow

1. Click Play on the start page.
2. In settings, choose a theme, at least one player, and a board size.
3. The Start button is enabled only after all required selections are set.
4. Flip cards and find matching pairs.
5. A match gives points; a mismatch switches the turn.
6. When all pairs are found, the game-over and winner/draw UI appears.

## :floppy_disk: localStorage Keys

The app persists user choices using:

- selectedTheme
- selectedPlayers
- boardCount

## :open_file_folder: Project Structure

```text
.
|-- index.html
|-- setting.html
|-- play.html
|-- src/
|   |-- main.ts
|   |-- gameplay.ts
|   |-- gamestate.ts
|   |-- render.ts
|   |-- board.ts
|   |-- player.ts
|   |-- theme.ts
|   |-- validation.ts
|   |-- exit.ts
|   |-- utils.ts
|   `-- styles/
|       |-- style.scss
|       `-- components/
|           |-- _animations.scss
|           |-- _base.scss
|           |-- _buttons.scss
|           |-- _game.scss
|           |-- _overlays.scss
|           |-- _play.scss
|           `-- _texts.scss
`-- public/
```

## :articulated_lorry: Styling Architecture

- src/styles/style.scss is the main stylesheet entry point.
- Modular SCSS partials are located in src/styles/components.
- The style files are split for maintainability and kept under 400 lines per file.

## :scroll: NPM Scripts

- npm run dev: start dev server
- npm run build: create production build
- npm run preview: preview the built output locally

## :ambulance: Troubleshooting

If Vite SCSS hot-reload fails:

1. Save the file again and hard refresh the browser.
2. Restart the dev server with npm run dev.
3. Check the first Sass error line in the terminal (often a bracket or import-order issue).

## :page_facing_up: License

ISC
