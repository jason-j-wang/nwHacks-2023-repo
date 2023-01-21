const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '58a419ef3amshf0356c674257641p181b37jsnd43b8bf5e5e5',
		'X-RapidAPI-Host': 'sportscore1.p.rapidapi.com'
	}
};

fetch('https://sportscore1.p.rapidapi.com/sports/1/teams?page=1', options)
	.then(response => response.json())
	.then(response => console.log(response))
	.catch(err => console.error(err));
