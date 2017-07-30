'use strict';

const requestPromise = require('request-promise');
const sleep = require('sleep-promise');
const fsPromise = require('fs-promise');


const main = async() => {
  
  const sortByIdAndTime = (ary) => {
    var num_a = -1;
    var num_b = 1;

    ary.sort((a, b) => {
      var x = Date.parse(a.details.releaseDate);
      var y = Date.parse(b.details.releaseDate);
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

  let anisonList = []

  let options = {
    uri: 'https://5ruupkvnb9.execute-api.ap-northeast-1.amazonaws.com/prod/song',
    json: true
  };

  try {
    anisonList = await requestPromise(options)
  } catch(err){
    console.log(err)
    process.exit(1)
  }

  anisonList = sortByIdAndTime(anisonList)
  await fsPromise.writeFile('./public/anisonList.json', JSON.stringify(anisonList))
}

main()
  .catch(function(val) { console.log(val) })

