var svg = d3.select('svg');

// Load the dataset
d3.dsv('\\','/data/US_final.csv').then(function(dataset) {
	videos = dataset;
	console.log(videos);
});