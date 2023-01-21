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

async function findGame(record) {
	return 0;
}

async function loadPage(record, game_idx) {
	var home_name = record['data'][game_idx]['home_team']['name'];
	var away_name = record['data'][game_idx]['away_team']['name'];
	document.getElementById("team1").innerHTML = home_name;
	document.getElementById("team2").innerHTML = away_name;

	var home_score = record['data'][game_idx]['home_score']['current'];
	var away_score = record['data'][game_idx]['away_score']['current'];
	var currentScore = home_score + " - " + away_score;

	document.getElementById("score").innerHTML= currentScore;

	var sport = record['data'][game_idx]['sport']['name'];

	document.getElementById("gameType").innerHTML= sport;

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
	const record = await fetchData();
	var game_idx = await findGame(record);
	console.log(record);
	console.log(game_idx);
	await loadPage(record, game_idx);
}

runAll();