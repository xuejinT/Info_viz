# Trending Videos On Youtube

Trending Videos On Youtube is an info visualization of Youtube trending videos from 1/31/2018 to 3/31/2018.

This is an academic project for course CS 7450 Fall 2019 georgia institute of technology.

## Team
Xuejin Tan, Xinhui Yang, Ruoxue Zhang

## Installation
### External URL: 

[http://www.tanxuejin.com/infovis/overview.html](http://www.tanxuejin.com/infovis/overview.html)

### To run locally:

Download files.Navigate to the folder `Info_viz`.

In the console execute the following command if you're running Python 2.x:
```
python -m SimpleHTTPServer 8080
```
if you're running Python 3.x or higher, use
```
python -m http.server 8080  (or python3 -m http.server 8080)
```
## Data
We keep the cleaned data in file `US_final.csv`, which uses a dataset on Kaggle. The publisher of this dataset also published the scraper they used to get the data from Youtube Api, which gives us the flexibility to modify the dataset as we need it.

Kaggle dataset: [https://www.kaggle.com/datasnaek/youtube-new](https://www.kaggle.com/datasnaek/youtube-new)

Scraper Github link: [https://github.com/DataSnaek/Trending-YouTube-Scraper](https://github.com/DataSnaek/Trending-YouTube-Scraper)

Youtube Data API: [https://developers.google.com/youtube/v3/docs](https://developers.google.com/youtube/v3/docs)
