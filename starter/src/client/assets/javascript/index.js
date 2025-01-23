// PROVIDED CODE BELOW (LINES 1 - 80) DO NOT REMOVE

// The store will hold all information needed globally
let store = {
	track_id: undefined,
	track_name: undefined,
	player_id: undefined,
	player_name: undefined,
	race_id: undefined,
}

// We need our javascript to wait until the DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
	onPageLoad()
	setupClickHandlers()
})

async function onPageLoad() {
	console.log("Getting form info for dropdowns!")
	try {
		getTracks()
			.then(tracks => {
				const html = renderTrackCards(tracks)
				renderAt('#tracks', html)
			})

		getRacers()
			.then((racers) => {
				const html = renderRacerCars(racers)
				renderAt('#racers', html)
			})
	} catch(error) {
		console.log("Problem getting tracks and racers ::", error.message)
		console.error(error)
	}
}

function setupClickHandlers() {
	document.addEventListener('click', function(event) {
		const { target } = event

		// Race track form field
		if (target.matches('.card.track')) {
			handleSelectTrack(target)
			store.track_id = target.id
			store.track_name = target.innerHTML
		}

		// Racer form field
		if (target.matches('.card.racer')) {
			handleSelectRacer(target)
			store.player_id = target.id
			store.player_name = target.innerHTML
		}

		// Submit create race form
		if (target.matches('#submit-create-race')) {
			event.preventDefault()
	
			// start race
			handleCreateRace()
		}

		// Handle acceleration click
		if (target.matches('#gas-peddle')) {
			handleAccelerate()
		}

		console.log("Store updated :: ", store)
	}, false)
}

async function delay(ms) {
	try {
		return await new Promise(resolve => setTimeout(resolve, ms));
	} catch(error) {
		console.log("an error shouldn't be possible here")
		console.log(error)
	}
}

// ^ PROVIDED CODE ^ DO NOT REMOVE

// BELOW THIS LINE IS CODE WHERE STUDENT EDITS ARE NEEDED ----------------------------
// TIP: Do a full file search for TODO to find everything that needs to be done for the game to work

// This async function controls the flow of the race, add the logic and error handling
async function handleCreateRace() {
    console.log("in create race");

    // Render the starting UI
    renderAt('#race', renderRaceStartView(store.track_name));

    try {
        // Get player_id and track_id from the store
        const player_id = store.player_id;
        const track_id = store.track_id;

        if (!player_id || !track_id) {
            throw new Error("Player and track must be selected before starting the race.");
        }

        // Call the createRace API
        const race = await createRace(player_id, track_id);

        // Update the store with the race id
        store.race_id = race.ID;

        console.log("Race created:", race);

        // Start the countdown, then start the race
        await runCountdown();
        await startRace(store.race_id);

        // Run the race and update the leaderboard
        await runRace(store.race_id);
    } catch (error) {
        console.error("Error in handleCreateRace:", error);
    }
}

function runRace(raceID) {
    return new Promise((resolve, reject) => {
        // Use setInterval to fetch race status every 500ms
        const raceInterval = setInterval(async () => {
            try {
                const raceData = await getRace(raceID);

                if (raceData.status === "in-progress") {
                    // Update the leaderboard with the current race positions
                    renderAt('#leaderBoard', raceProgress(raceData.positions));
                } else if (raceData.status === "finished") {
                    // Clear the interval
                    clearInterval(raceInterval);

                    // Render the final results
                    renderAt('#race', resultsView(raceData.positions));

                    // Resolve the promise to indicate the race is done
                    resolve(raceData);
                }
            } catch (error) {
                console.error("Error fetching race data:", error);
                clearInterval(raceInterval); // Stop the interval if there's an error
                reject(error);
            }
        }, 500); // Poll every 500ms
    });
}

async function runCountdown() {
    try {
        // Wait for 1 second to ensure the DOM is fully loaded
        await delay(1000);
        let timer = 3;

        return new Promise(resolve => {
            // Use setInterval to decrement the countdown every second
            const countdownInterval = setInterval(() => {
                document.getElementById('big-numbers').innerHTML = timer;

                if (timer === 0) {
                    clearInterval(countdownInterval); // Stop the countdown
                    resolve(); // Resolve the promise to continue the race flow
                } else {
                    timer -= 1; // Decrement the timer
                }
            }, 1000);
        });
    } catch (error) {
        console.error("Error in runCountdown:", error);
    }
}

function handleSelectRacer(target) {
    console.log("selected a racer", target.id);

    // Remove the "selected" class from all racer options
    const selected = document.querySelector('#racers .selected');
    if (selected) {
        selected.classList.remove('selected');
        selected.style.borderColor = ''; // Reset border color
    }

    // Add the "selected" class to the current target
    target.classList.add('selected');

    // Map racer names to colors
    const racerColors = {
        'Green Racer': 'green',
        'Yellow Racer': 'yellow',
        'Purple Racer': 'purple',
        'Red Racer': 'red',
        'Blue Racer': 'blue',
    };

    // Get the driver's name from the target and apply the matching color
    const racerName = target.innerText.trim();
    const borderColor = racerColors[racerName] || 'black'; // Default to black if not found
    target.style.borderColor = borderColor;
    target.style.borderWidth = '4px'; // Ensure the border width is visible
}

function handleSelectTrack(target) {
	console.log("selected track", target.id)

	// remove class selected from all track options
	const selected = document.querySelector('#tracks .selected')
	if (selected) {
		selected.classList.remove('selected')
	}

	// add class selected to current target
	target.classList.add('selected')	
}

function handleAccelerate() {
    console.log("Accelerate button clicked");
    const raceID = store.race_id;

    if (!raceID) {
        console.error("No race ID found in the store!");
        return;
    }

    accelerate(raceID)
        .then(() => {
            console.log("Accelerate API call successful");
        })
        .catch(error => {
            console.error("Error in handleAccelerate:", error);
        });
}

// HTML VIEWS ------------------------------------------------
// Provided code - do not remove

function renderRacerCars(racers) {
	if (!racers.length) {
		return `
			<h4>Loading Racers...</4>
		`
	}

	const results = racers.map(renderRacerCard).join('')

	return `
		<ul id="racers">
			${results}
		</ul>
	`
}

function renderRacerCard(racer) {
	const { id, driver_name, top_speed, acceleration, handling } = racer
	// OPTIONAL: There is more data given about the race cars than we use in the game, if you want to factor in top speed, acceleration, 
	// and handling to the various vehicles, it is already provided by the API!
	
    const formattedName = driver_name.replace(/racer/gi, 'Racer');

    return `<h4 class="card racer" id="${id}">${formattedName}</h4>`;
}

function renderTrackCards(tracks) {
	if (!tracks.length) {
		return `
			<h4>Loading Tracks...</4>
		`
	}

	const results = tracks.map(renderTrackCard).join('')

	return `
		<ul id="tracks">
			${results}
		</ul>
	`
}

function renderTrackCard(track) {
	const { id, name } = track

	return `<h4 id="${id}" class="card track">${name}</h4>`
}

function renderCountdown(count) {
	return `
		<h2>Race Starts In...</h2>
		<p id="big-numbers">${count}</p>
	`
}

function renderRaceStartView(track) {
	return `
		<header>
			<h1>Race: ${track.name}</h1>
		</header>
		<main id="two-columns">
			<section id="leaderBoard">
				${renderCountdown(3)}
			</section>

			<section id="accelerate">
				<h2>Directions</h2>
				<p>Click the button as fast as you can to make your racer go faster!</p>
				<button id="gas-peddle">Click Me To Win!</button>
			</section>
		</main>
		<footer></footer>
	`
}

function resultsView(positions) {
    let count = 1;

    const results = positions.map((p, index) => {
        const formattedName = p.driver_name.replace(/racer/gi, 'Racer'); // Capitalize "Racer"
        const trophy = index === 0 ? '🏆' : ''; // Add trophy for the winner
        return `
            <tr>
                <td style="padding: 10px; font-size: 18px;">
                    <strong>${count++}</strong> - ${formattedName} ${trophy}
                </td>
            </tr>
        `;
    });

    return `
        <header>
            <h1 style="text-align: center; font-size: 36px; margin-bottom: 20px;">Race Results</h1>
        </header>
        <main style="text-align: center;">
            <h3 style="font-size: 20px; margin-bottom: 20px;">The race is over! Here are the results:</h3>
            <table style="margin: 0 auto; border-collapse: collapse;">
                ${results.join('')}
            </table>
            <a id="start-new-race" href="/race" style="display: inline-block; margin-top: 30px; padding: 15px 30px; font-size: 20px; font-weight: bold; text-decoration: none; background-color: #007BFF; color: white; border-radius: 10px; transition: background-color 0.3s ease;">
                Start a New Race
            </a>
        </main>
    `;
}

function raceProgress(positions) {
	let userPlayer = positions.find(e => e.id === parseInt(store.player_id))
	userPlayer.driver_name += " (you)"

	positions = positions.sort((a, b) => (a.segment > b.segment) ? -1 : 1)
	let count = 1

	const results = positions.map(p => {
		return `
			<tr>
				<td>
					<h3>${count++} - ${p.driver_name}</h3>
				</td>
			</tr>
		`
	})

	return `
		<table>
			${results.join('')}
		</table>
	`
}

function renderAt(element, html) {
	const node = document.querySelector(element)

	node.innerHTML = html
}

// ^ Provided code ^ do not remove


// API CALLS ------------------------------------------------

const SERVER = 'http://localhost:3001'

function defaultFetchOpts() {
	return {
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin' : SERVER,
		},
	}
}

// TODO - Make a fetch call (with error handling!) to each of the following API endpoints 

function getTracks() {
    console.log(`calling server :: ${SERVER}/api/tracks`);
    return fetch(`${SERVER}/api/tracks`, {
        method: 'GET',
        ...defaultFetchOpts(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching tracks:", error);
        });
}

function getRacers() {
    console.log(`calling server :: ${SERVER}/api/cars`);
    return fetch(`${SERVER}/api/cars`, {
        method: 'GET',
        ...defaultFetchOpts(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error("Error fetching racers:", error);
        });
}


function createRace(player_id, track_id) {
    player_id = parseInt(player_id);
    track_id = parseInt(track_id);
    const body = { player_id, track_id };

    console.log("Sending createRace request with:", body); // Debugging

    return fetch(`${SERVER}/api/races`, {
        method: 'POST',
        ...defaultFetchOpts(),
        body: JSON.stringify(body),
    })
    .then(res => res.json())
    .catch(err => console.log("Problem with createRace request::", err));
}

function getRace(id) {
    return fetch(`${SERVER}/api/races/${id}`, {
        method: 'GET',
        ...defaultFetchOpts(),
    })
        .then(response => response.json())
        .catch(error => console.error("Error fetching race:", error));
}

function startRace(id) {
	return fetch(`${SERVER}/api/races/${id}/start`, {
		method: 'POST',
		...defaultFetchOpts(),
	})
	.then(res => res.json())
	.catch(err => console.log("Problem with getRace request::", err))
}

function accelerate(id) {
    return fetch(`${SERVER}/api/races/${id}/accelerate`, {
        method: 'POST',
        ...defaultFetchOpts(),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to accelerate! HTTP status: ${response.status}`);
            }
            return response;
        })
        .catch(error => {
            console.error("Error in accelerate API call:", error);
        });
}
