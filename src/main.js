'use strict';

require('babel-polyfill');

const requestPromise = require('request-promise');
import sleep from 'sleep-promise';
const fsPromise = require('fs-promise');


const main = async() => {
  
  const sortByIdAndTime = (ary) => {
    var num_a = -1;
    var num_b = 1;

    ary.sort((a, b) => {
      var x = Date.parse(a['releaseDate']);
      var y = Date.parse(b['releaseDate']);
      if (x > y) return num_a;
      if (x < y) return num_b;

      var x = a.collectionId;
      var y = b.collectionId;
      if (x > y) return num_a;
      if (x < y) return num_b;
      return 0
    })
    return ary
  }

  const isDup = (obj,target) => {
    let flag = false
    obj.forEach(song => {
      if (song.collectionId === target){
        flag = true
      }
    })
    return flag
  }

  let endFlag = false
  let offsetNum = 0
  let anisonList = []

  while (endFlag === false){


    let options = {
        uri: 'https://itunes.apple.com/search?term=4&entity=album&media=music&country=jp&lang=ja_jp&limit=200&attribute=genreIndex&offset=' + offsetNum,
        json: true
    };

    let resp = await requestPromise(options)

    const before2week = Date.now() - 1209600000
    
    if (resp.resultCount > 0){
      resp.results.forEach(song => {
        let tmp = {}
        if (Date.parse(song.releaseDate) > before2week ){
          tmp.collectionId = song.collectionId
          tmp.artistName = song.artistName
          tmp.collectionName = song.collectionName
          tmp.artworkUrl100 = song.artworkUrl100
          tmp.releaseDate = song.releaseDate
          tmp.collectionViewUrl = song.collectionViewUrl

          if(isDup(anisonList,tmp.collectionId) == false){
            anisonList.push(tmp)
          }
        }
      })
    }
    
    offsetNum = offsetNum + 200    
    if (resp.resultCount === 0){
      endFlag = true
    }
    await sleep(5000);

  }
  
  anisonList = sortByIdAndTime(anisonList)
  await fsPromise.writeFile('./public/anisonList.json', JSON.stringify(anisonList))

}

main ();

