var api_key = config.API_KEY;

async function fetchData() {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': api_key,
			'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com'
		}
	};
	
	const res = await fetch('https://sportscore1.p.rapidapi.com/events/live?page=1', options)
    const record = await res.json();
	return record;
}

function setGame() {
	
}

async function findGame(record) {
	var num_games = record['meta']['to'];
	try {
		var game_id = await chrome.storage.local.get(['game_id']);
	}
	catch {
		console.log('game id not found, setting to 0')
		await chrome.storage.local.set({
			'game_id': record['data'][0]['id']
		});
		return 0;
	}
	game_id = game_id.game_id;
	for (let idx = 0; idx < num_games; idx++) {
		var cur_game_id = record['data'][idx]['id']
		if (cur_game_id == game_id) {
			await chrome.storage.local.set({
				'game_id': cur_game_id
			});
			console.log('game found at idx ' + idx);
			return idx;
		}
	}
	console.log('game not found, returning idx 0')
	await chrome.storage.local.set({
		'game_id': record['data'][0]['id']
	});
	return 0;
}

async function loadPage(record, game_idx) {
	// team names
	var home_name = record['data'][game_idx]['home_team']['name'];
	var away_name = record['data'][game_idx]['away_team']['name'];
	document.getElementById("team1").innerHTML = home_name;
	document.getElementById("team2").innerHTML = away_name;

	// sport type
	var sport = record['data'][game_idx]['sport']['name'];
	document.getElementById("gameType").innerHTML= sport;

	// score
	if (sport == "Tennis") {
		var home_score = record['data'][game_idx]['home_score']['point'];
		var away_score = record['data'][game_idx]['away_score']['point'];
	} else {
		var home_score = record['data'][game_idx]['home_score']['current'];
		var away_score = record['data'][game_idx]['away_score']['current'];
	}
	var currentScore = home_score + " - " + away_score;
	document.getElementById("score").innerHTML= currentScore;

	// time period/half...etc
	var time = record['data'][game_idx]['status_more'];
	document.getElementById("time").innerHTML= time;

	// load logo
	if (record['data'][game_idx]['home_team']['has_logo']) {
		let homeLogoSrc = record['data'][game_idx]['home_team']['logo'];
		document.getElementById("team1").getElementsByTagName("homeLogo").src=homeLogoSrc;
	}
	if (record['data'][game_idx]['away_team']['has_logo']) {
		let awayLogoSrc = record['data'][game_idx]['away_team']['logo'];
		document.getElementById("team2").getElementsByTagName("awayLogo").src=awayLogoSrc;
	}

	// get list of current games for dropdown
	const dropDown = document.getElementById("dropdown");
	const allGamesData = record['data'];
	for (let key in allGamesData) {
		let option = document.createElement("option");
		option.setAttribute('value', allGamesData[key]['name']);

		let optionText = document.createTextNode(allGamesData[key]['name']);
		option.appendChild(optionText);

		dropDown.appendChild(option);
	}
}

async function runAll() {
	document.getElementById("submit").addEventListener("click", setGame);

	const record = await fetchData();
	var game_idx = await findGame(record);
	console.log(record);
	await loadPage(record, game_idx);
}

runAll();