Welcome to the UdaciRacer Simulation Game

Project Introduction

UdaciRacer is a dynamic car racing simulator game that allows players to choose racers, select tracks, and compete in an engaging simulation. This game was built as part of a course project to demonstrate asynchronous JavaScript skills. The game logic is enriched with live race progress, leaderboards, and a final results view, offering an interactive experience.

Game Features: 1. Create a Race: Choose a track and a racer to start. 2. Race Progress: See live race progress and accelerate your racer. 3. Final Results: View rankings and restart the game.

Project Setup

The project consists of two main components: 1. API Server: A backend server written in Go that simulates the game logic and provides data for tracks, racers, and race results. 2. Frontend Application: The client-side code, written in JavaScript, handles game interactions and UI rendering.

Getting Started

Prerequisites:
• Node.js (version 16.x or later)
• Go (Golang version 1.19+)
• A modern web browser (e.g., Chrome, Firefox, Edge)

Setup Instructions: 1. Clone the repository and navigate to the project directory. 2. Start the API Server:
• Navigate to the api folder.
• Compile the Go code.
• Start the server. The API server will run on http://localhost:3001. 3. Start the Frontend Application:
• Navigate back to the project root.
• Install dependencies.
• Start the frontend. The frontend will run on http://localhost:3002.

How to Play 1. Create a Race:
• Choose a track and a racer from the options provided.
• Click “Start My Race” to begin. 2. Race Progress:
• Watch the live leaderboard and click the “Gas Peddle” button to accelerate your racer. 3. Final Results:
• View the race standings and click “Start a New Race” to play again.

Technical Overview

Asynchronous JavaScript Implementation

This project uses async/await and promises to handle API calls and game logic efficiently:
• Fetch data from the API (e.g., racers, tracks).
• Poll the race status during progress updates.
• Handle errors gracefully with try/catch.

Backend API Endpoints

The backend API provides data and endpoints to manage races. Below are the key endpoints:
• [GET] /api/tracks: Returns a list of all available tracks.
• [GET] /api/cars: Returns a list of all available racers.
• [GET] /api/races/${id}: Returns the current status and details of a specific race.
	•	[POST] /api/races: Creates a new race.
	•	[POST] /api/races/${id}/start: Starts a race.
• [POST] /api/races/${id}/accelerate: Accelerates the player’s car in the race.

File Structure
• src/api: Backend API server written in Go.
• src/client: Frontend assets and JavaScript logic.
• src/client/assets/javascript/index.js: Main game logic and API calls.
• src/client/assets/stylesheets: CSS styles.

Enhancements 1. Added Styling:
• Improved visuals with a background image on the homepage and race screens.
• Modernized buttons and UI elements for better usability. 2. Error Handling:
• Handled cases where the backend API may return incomplete or missing data. 3. Dynamic Leaderboard:
• Added live race progress with periodic updates. 4. Responsive Design:
• Ensured the game works well across different screen sizes.

Known Issues 1. Backend Limitations:
• Some backend API responses may return incomplete data (e.g., missing race status). The frontend includes fallback logic to handle such cases gracefully. 2. Browser Compatibility:
• Tested primarily on modern browsers. Older browsers may experience styling issues.
