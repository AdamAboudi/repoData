var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");  // Add main svg element

const username = "walshk";
const repoLink = "https://api.github.com/users/" + username + "/repos";  // Repository link

var avatar_url = "https://github.com/" + username + ".png";

const margin = {"left": 20, "right": 20, "top": 20, "bottom": 20};
const config = {"avatar_size": 150};

var repos = [];



function redraw() {


	/*************************************************************

			LOADING DATA

	*************************************************************/

	repos = [];

	// Get current width and height of window
	const width = chartDiv.clientWidth,
		height = chartDiv.clientHeight;

	// Set width and height of svg
	svg
		.attr("width", width)
		.attr("height", height);

	// Start github API calls with D3
	d3.json(repoLink).then(function(data) {

		// Iterate through repos
		for (let i = 0; i < data.length; i++) {
			const currentRepo = data[i];  // easier to understand name
			let repoData = {};

			repoData.name = currentRepo.name;
			repoData.link = currentRepo.html_url;

			// API call for language makeup for each repository
			d3.json(currentRepo.languages_url).then(function(data) {
				repoData.langs = data;  // saves JSON object with language data for each repo
			


				// API call for total commits to each repository
				d3.json(currentRepo.contributors_url).then(function(data) {
					// Iterate through contributors and sum total commits
					let totalCommits = 0;
					for (let i = 0; i < data.length; i++) {
						totalCommits += data[i].contributions;
					}
					repoData.commits = totalCommits;
				

					repos.push(repoData);

					draw();

				});
			});
		}

	});
}

function draw() {

	svg.selectAll("svg").remove();  // reset drawing


	/*********************************************
		TOP SVG ELEMENT AREA
	*********************************************/

	config.avatar_size = chartDiv.clientHeight / 7;

	var topSVG = svg.append("svg")
		.attr("width", function() {
			return chartDiv.clientWidth;
		})
		.attr("height", function() {
			return chartDiv.clientHeight / 4;
		});


	// Add avatar image
	var defs = topSVG.append("svg:defs");

	// Set up avatar image pattern definition
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

	// Background for avatar SVG
	var rectangle = topSVG.append("rect")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("fill", "aliceblue");

	// Circle for avatar image
	var circle = topSVG.append("circle")
		.attr("cx", margin.left + config.avatar_size / 2)
		.attr("cy", margin.top + config.avatar_size / 2)
		.attr("r", config.avatar_size / 2)
		.style("fill", "#fff")
		.style("fill", "url(#avatar)");

	// Username text display
	var usernameDisplay = topSVG.append("text")
		.attr("id", "username")
		.attr("x", margin.left + config.avatar_size / 2)
		.attr("y", margin.top + config.avatar_size * 1.35)
		.attr("font-family", "Lato")
		.attr("font-weight", "bold")
		.attr("font-size", "145%")
		.attr("text-anchor", "middle")
		.text(username.toUpperCase());

	// Calculate total commits for user
	let totalComs = 0;
	for (let i = 0; i < repos.length; i++) {
		totalComs += repos[i].commits;
	}

	var totalCommitsText = topSVG.append("text")
		.attr("id", "totalCommits")
		.attr("x", margin.left + config.avatar_size / 2)
		.attr("y", margin.top + config.avatar_size * 1.55)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("text-anchor", "middle")
		.text("Commits: " + totalComs);


	/**********************************************
		BOTTOM SVG ELEMENT AREA
	**********************************************/
	var bottomSVG = svg.append("svg")
		.attr("width", function() {
			return chartDiv.clientWidth;
		})
		.attr("y", function() {
			return chartDiv.clientHeight / 4;
		});

	// Bottom SVG background color
	bottomSVG.append("rect")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("fill", "orange")
		.attr("opacity", 0.4);

	var radScale = d3.scaleLinear()
		.domain([0,200])
		.range([30, 100]);

	const colors = ["red", "orange", "blue", "green"];

	bottomSVG.selectAll("circle")
		.data(repos)
		.enter()
		.append("svg:circle")
			.attr("cx", function(d, i) {
				return i * 50 + 20;
			})
			.attr("cy", function() {
				return chartDiv.clientHeight / 2;
			})
			.attr("r", function(d) {
				return radScale(d.commits);
			})
			.attr("fill", function(d,i) {
				return colors[i % colors.length];
			})
			.attr("opacity", 0.6)
			.attr("stroke", "black");


}

redraw();
//window.addEventListener("resize", redraw);