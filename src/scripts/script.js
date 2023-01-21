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
	console.log(record)

	var home_name = record['data'][0]['home_team']['name'];
	var away_name = record['data'][0]['away_team']['name'];
	document.getElementById("team1").innerHTML = home_name;
	document.getElementById("team2").innerHTML = away_name;

	var home_score = record['data']['0']['home_score']['current'];
	var away_score = record['data']['0']['away_score']['current'];
	var currentScore = home_score + " - " + away_score;

	document.getElementById("score").innerHTML= currentScore;
	
}
fetchData();
