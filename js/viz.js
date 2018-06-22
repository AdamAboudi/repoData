var chartDiv = document.getElementById("chart");
var svg = d3.select(chartDiv).append("svg");  // Add main svg element

const username = "walshk";
const repoLink = "https://api.github.com/users/" + username + "/repos";  // Repository link

var avatar_url = "https://github.com/" + username + ".png";

const margin = {"left": 20, "right": 20, "top": 20, "bottom": 20};
const config = {"avatar_size": 150};

var repos = [];


var printLangs = function(langs) {
	var toString = "";

	for (language in langs) {
		toString += language + ", ";
	}

	return toString.substring(0, toString.length - 2);
}

const bgColor = "#7EC6BA"

svg.attr("background", bgColor);

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
		.attr("fill", bgColor);

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

	var repoInfoName0 = topSVG.append("text")
		.attr("id", "repoName0")
		.attr("x", margin.left + config.avatar_size * 2)
		.attr("y", margin.top + config.avatar_size / 4)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("font-weight", "bold")
		.attr("text-anchor", "end")
		.text("Repository: ");

	var repoInfoCommits0 = topSVG.append("text")
		.attr("id", "repoCommits0")
		.attr("x", margin.left + config.avatar_size * 2)
		.attr("y", margin.top + config.avatar_size / 4 + 45)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("font-weight", "bold")
		.attr("text-anchor", "end")
		.text("User Commits: ");

	var repoInfoLangs0 = topSVG.append("text")
		.attr("id", "repoLangs0")
		.attr("x", margin.left + config.avatar_size * 2)
		.attr("y", margin.top + config.avatar_size / 4 + 90)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("font-weight", "bold")
		.attr("text-anchor", "end")
		.text("Languages: ");

	var repoInfoName = topSVG.append("text")
		.attr("id", "repoName")
		.attr("x", margin.left + config.avatar_size * 2 + 10)
		.attr("y", margin.top + config.avatar_size / 4)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("text-anchor", "start")
		.text("none selected");

	var repoInfoCommits = topSVG.append("text")
		.attr("id", "repoCommits")
		.attr("x", margin.left + config.avatar_size * 2 + 10)
		.attr("y", margin.top + config.avatar_size / 4 + 45)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("text-anchor", "start")
		.text("none selected");

	var repoInfoLangs = topSVG.append("text")
		.attr("id", "repoLangs")
		.attr("x", margin.left + config.avatar_size * 2 + 10)
		.attr("y", margin.top + config.avatar_size / 4 + 90)
		.attr("font-family", "Lato")
		.attr("font-size", "110%")
		.attr("text-anchor", "start")
		.text("none selected");



	/**********************************************
		BOTTOM SVG ELEMENT AREA
	**********************************************/
	var bottomSVG = svg.append("svg")
		.attr("width", function() {
			return chartDiv.clientWidth;
		})
		.attr("height", function() {
			return chartDiv.clientHeight;
		})
		.attr("y", function() {
			return chartDiv.clientHeight / 4;
		})
		.attr("id", "bottomSVG");

	console.log(bottomSVG.attr("width"));

	// Bottom SVG background color
	bottomSVG.append("rect")
		.attr("width", "100%")
		.attr("height", "100%")
		.attr("fill", bgColor);

	
	const colors = ["#E27D60", "#E8A87C"];

	


	repos.sort(function(a, b) {
		return b.commits - a.commits;
	});


	bottomSVG.selectAll("circle")
		.data(repos)
		.enter()
		.append("svg:circle")
			.attr("class", "node")
			.attr("cx", function() { 
				return +bottomSVG.attr("width") / 2;
			})
			.attr("cy", function() {
				return +bottomSVG.attr("height") / 2.5;
			})
			.attr("r", function(d, i) {
				return bottomSVG.attr("height")/3 - i*40;
			})
			.attr("fill", function(d,i) {
				return bgColor;
			})
			.attr("opacity", 1)
			.attr("stroke", bgColor)
			.attr("stroke-width", "1.5px")
			.style("cursor", "pointer")
			.on("mouseover", function(d,i) {
				d3.select(this).style("fill", "#C38D9E");

				d3.selectAll("#repoName").text(d.name);
				d3.selectAll("#repoCommits").text(d.commits);
				d3.selectAll("#repoLangs").text(printLangs(d.langs));

			})
			.on("mouseout", function(d,i) {
				d3.select(this).style("fill", function() {
					return colors[i % colors.length];
				});

				d3.selectAll("#repoName").text("none selected");
				d3.selectAll("#repoCommits").text("none selected");
				d3.selectAll("#repoLangs").text("none selected");

			})
			.on("click", function(d) {
				window.location.href = "https://github.com/" + username + "/" + d.name;
			})
			.transition()
			.duration(2000)
				.attr("stroke", "black")
				.transition()
				.duration(1000)
					.attr("fill", function(d, i) {
						return colors[i % colors.length];
					});

}

// resize with window
redraw();
window.addEventListener("resize", redraw);