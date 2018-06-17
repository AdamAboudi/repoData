var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");  // Add main svg element

const username = "walshk";
const repoLink = "https://api.github.com/users/" + username + "/repos";  // Repository link

var repos = [];
var avatar_url = "https://github.com/" + username + ".png";

const margin = {"left": 20, "right": 20, "top": 20, "bottom": 20};
const config = {"avatar_size": 150};

var accountCommits = 0;

function pullData() {
	console.log(repoLink);

	var sorted;

	// Get current width and height of window
	const width = chartDiv.clientWidth,
		height = chartDiv.clientHeight;

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

			console.log(currentRepo);

			repoData.name = currentRepo.name;
			repoData.link = currentRepo.html_url;

			// API call for language makeup for each repository
			d3.json(currentRepo.languages_url).then(function(data) {
				repoData.langs = data;  // saves JSON object with language data for each repo
			});


			d3.json(currentRepo.contributors_url).then(function(data) {
				// Iterate through contributors and sum total commits
				totalCommits = 0;
				for (let i = 0; i < data.length; i++) {
					totalCommits += data[i].contributions;
				}
				repoData.commits = totalCommits;
			}); 

			repos.push(repoData);
		}
	});
}


function redraw() {

	svg.selectAll("svg").remove();

	repos = [];  // reset repos list
	pullData();  // repopulate repos list\



	config.avatar_size = chartDiv.clientHeight / 7;

	var avatarSVG = svg.append("svg")
		.attr("width", function() {
			return chartDiv.clientWidth;
		})
		.attr("height", function() {
			return chartDiv.clientHeight / 4;
		});


	// Add avatar image
	var defs = avatarSVG.append("svg:defs");

	defs.append("svg:pattern")
		.attr("id", "avatar")
		.attr("width", "1")
		.attr("height", "1")
		.append("svg:image")
			.attr("xlink:href", avatar_url)
			.attr("width", config.avatar_size)
			.attr("height", config.avatar_size)
			.attr("x", 0)
			.attr("y", 0);


	var rectangle = avatarSVG.append("rect")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("fill", "aliceblue");


	var circle = avatarSVG.append("circle")
		.attr("cx", margin.left + config.avatar_size / 2)
		.attr("cy", margin.top + config.avatar_size / 2)
		.attr("r", config.avatar_size / 2)
		.style("fill", "#fff")
		.style("fill", "url(#avatar)");

	var usernameDisplay = avatarSVG.append("text")
		.attr("x", margin.left + config.avatar_size / 2)
		.attr("y", margin.top + config.avatar_size * 1.2)
		.attr("text-anchor", "middle")
		.text(username);

}

redraw();
window.addEventListener("resize", redraw);