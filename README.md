# Info_viz
# Data

Now the cleaned data file is "US_final.csv", with trending videos from 2018-01-01 to 2018-04-30. The separator is the character `\`, not `,`, to avoid parsing error when reading the file. When loading the file into d3, use `d3.dsv('\\','US_final.csv').then(function(dataset) {...`. 

