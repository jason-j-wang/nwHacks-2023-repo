var api_key = config.API_KEY;

async function fetchData() {
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': api_key,
			'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com'
		}
	};
	
	fetch('https://sportscore1.p.rapidapi.com/events/live?page=1', options)
		.then(response => response.json())
		.then(response => console.log(response))
		.catch(err => console.error(err));
}
fetchData();
