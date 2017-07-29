'use strict';

require('babel-polyfill');

const RSS = require('rss');
const requestPromise = require('request-promise');
const fsPromise = require('fs-promise');

const main = async() => {

  const feed = new RSS({
    title: "Anison.me",
    feed_url: "https://i.anison.me/feed.xml",
    site_url: "https://i.anison.me"
  });
  
  let options = {
    uri: 'https://i.anison.me/anisonList.json',
    json: true
  };

  let resp = await requestPromise(options)
  
  resp.forEach(song => {
    let tmp = {}
    tmp.title = song.details.collectionName + " / " + song.details.artistName
    tmp.url = "https://i.anison.me/#" + song.details.collectionId
    tmp.guid = song.details.collectionId
    tmp.date = song.details.releaseDate
    tmp.enclosure = {}
    tmp.enclosure.url = song.details.artworkUrl100
    tmp.enclosure.size = 1234
    tmp.enclosure.type = 'image/jpeg'
    feed.item(tmp)
  })
  
  const xml = feed.xml({indent: true});
  await fsPromise.writeFile('public/feed.xml', xml)
}

main()