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

async function setGame() {
	var options = document.getElementById("dropdown");
	var id = options[options.selectedIndex].id;
	await chrome.storage.local.set({
		'game_id': id
	});
	runAll();
}

async function findGame(record) {
	var num_games = record['meta']['to'];
	try {
		var game_id = await chrome.storage.local.get(['game_id']);
	}
	catch {
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
			return idx;
		}
	}
	await chrome.storage.local.set({
		'game_id': record['data'][0]['id']
	});
	return 0;
}

async function loadPage(record, game_idx) {
	// team names
	var home_name = record['data'][game_idx]['home_team']['name'];
	var away_name = record['data'][game_idx]['away_team']['name'];
	
	document.getElementById("team1").innerHTML = home_name.bold();
	document.getElementById("team1").style.textShadow = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"; 
	document.getElementById("team1").style.color = "white";
	document.getElementById("team1").style.fontSize = "20px";
	document.getElementById("team2").innerHTML = away_name.bold();
	document.getElementById("team2").style.textShadow = "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000"; 
	document.getElementById("team2").style.color = "white";
	document.getElementById("team2").style.fontSize = "20px";

	// sport type
	var sport = record['data'][game_idx]['sport']['name'];
	document.getElementById("gameType").innerHTML= sport.bold();
	document.getElementById("gameType").style.fontSize = "30px";

	// score
	if (sport == "Tennis") {
		var home_score = record['data'][game_idx]['home_score']['point'];
		var away_score = record['data'][game_idx]['away_score']['point'];
	} else {
		var home_score = record['data'][game_idx]['home_score']['current'];
		var away_score = record['data'][game_idx]['away_score']['current'];
	}
	var currentScore = home_score + " - " + away_score;
	document.getElementById("score").innerHTML= currentScore.bold();
	document.getElementById("score").style.textShadow = "-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF"; 
	document.getElementById("score").style.color = "black";

	// time
	var time = record['data'][game_idx]['status_more'];
	document.getElementById("time").innerHTML= time.bold();
	document.getElementById("time").style.textShadow = "-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF"; 
	document.getElementById("time").style.color = "black";

	// load logo
	if (record['data'][game_idx]['home_team']['has_logo']) {
		let homeLogoSrc = record['data'][game_idx]['home_team']['logo'];
		document.getElementById("homeLogo").src=homeLogoSrc;
	}
	if (record['data'][game_idx]['away_team']['has_logo']) {
		let awayLogoSrc = record['data'][game_idx]['away_team']['logo'];
		document.getElementById("awayLogo").src=awayLogoSrc;
	}
}

async function runAll() {
	var game_idx = await findGame(record);
	await loadPage(record, game_idx);
}

async function startRun() {
	api_key = config.API_KEY;
	record = await fetchData();
	document.getElementById("submit").addEventListener("click", setGame);
	await runAll();

	// get list of current games for dropdown
	const dropDown = document.getElementById("dropdown");
	const allGamesData = record['data'];
	for (let key in allGamesData) {
		let option = document.createElement("option");
		option.setAttribute('value', allGamesData[key]['name']);
		option.id = allGamesData[key]['id'];

		let optionText = document.createTextNode(allGamesData[key]['name']);
		option.appendChild(optionText);

		dropDown.appendChild(option);
	}
	document.getElementById("refresh").onclick = async function() {
		record = await fetchData();
		runAll();
	};
}

var api_key;
var record;

startRun();