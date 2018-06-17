var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");  // Add main svg element

const username = "walshk";
const repoLink = "https://api.github.com/users/" + username + "/repos";  // Repository link

var repos = [];


function redraw() {
	console.log(repoLink);

	var sorted;

	// Get current width and height of window
	const width = chartDiv.clientWidth,
		height = chartDiv.clientHeight;


	const margin = {"left": 20, "right": 20, "top": 20, "bottom": 20};

	// Set width and height of svg
	svg
		.attr("width", width)
		.attr("height", height);

	// Start d3
	d3.json(repoLink).then(function(data) {

		// Iterate through repos
		for (let i = 0; i < data.length; i++) {
			const currentRepo = data[i];  // easier to understand name
			let repoData = {};

			repoData.name = currentRepo.name;
			repoData.link = currentRepo.html_url;

			d3.json(currentRepo.languages_url).then(function(data) {
				repoData.langs = data;  // saves JSON object with language data for each repo
			
				console.log(repoData);
			});

			repos.push(repoData);

		}

	});

}

redraw();
window.addEventListener("resize", redraw);