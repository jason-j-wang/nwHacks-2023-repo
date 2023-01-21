async function fetchData() {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '',
			'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com'
		}
	};

	const res = await fetch('https://sportscore1.p.rapidapi.com/events/live?page=1', options)
		.then(response => response.json())
		.then(response => console.log(response))
		.catch(err => console.error(err));

	const record = await res.json();
	document.getElementById("team1").innerHTML=record.data[0].team1;
	document.getElementById("team2").innerHTML=record.data[0].team2;

}
fetchData();
