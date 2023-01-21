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

	var home_name = record['data']['0']['home_team']['0']['name'];
    console.log(home_name);
	//document.getElementById("team1").innerHTML = record.data[0].date;

	
}
fetchData();
