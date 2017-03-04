'use strict';

require('babel-polyfill');

const requestPromise = require('request-promise');
import sleep from 'sleep-promise';
const fsPromise = require('fs-promise');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient({'region':'ap-northeast-1'});
const moment = require('moment')

const main = async() => {

  // 
  const isDup = (ary,target) => {
    let flag = false
    ary.forEach(song => {
      if (song === target){
        flag = true
      }
    })
    return flag
  }
  
  const putDynamo = async(collectionId,details) => {
    var params = {
      TableName : 'anison.me',
      Item: {
       collectionId: collectionId,
       details: details,
       ttl: moment().add(3,'weeks').unix()
      }
    };

    try {
      await dynamoDb.put(params).promise();
    } catch(err){
      console.log(err)
      process.exit(1)
    }
    await sleep(1000);    
  }

  const isRegistered = (id) => {
    let flag = false
    nowList.Items.forEach(item =>{
      if (item.collectionId === id){
        flag = true
      }
    })
    return flag
  }

  // SearchAPIにアクセスしてjsonを返す
  const searchAPI = async(offsetNum) => {
    let resp = ''
    let options = {
      uri: 'https://itunes.apple.com/search?term=4&entity=album&media=music&country=jp&lang=ja_jp&limit=200&attribute=genreIndex&offset=' + offsetNum,
      json: true
    };

    try {
      resp = await requestPromise(options)
    } catch(err){
      console.log(err)
      process.exit(1)
    }
    return resp
  }

  let checkedList = []
  const offsets = [200,150];
  const nowList = await dynamoDb.scan({'TableName':'anison.me'}).promise();

  // dynamoDBのDBのテーブル更新
  for (let offset of offsets) {
    console.log('offset ' + offset + ' start.')

    let endFlag = false
    let offsetNum = 0
    let resp = ''
    const before2week = Date.now() - 1209600000

    while (endFlag === false){
        
      resp = await searchAPI(offsetNum)

      if (resp.resultCount > 0){
        resp.results.forEach(async(song) => {
          let details = {}
          if (Date.parse(song.releaseDate) > before2week ){
            details.collectionId = song.collectionId
            details.artistName = song.artistName
            details.collectionName = song.collectionName
            details.artworkUrl100 = song.artworkUrl100
            details.releaseDate = song.releaseDate
            details.collectionViewUrl = song.collectionViewUrl

            // 初めて登場した曲で indexOfでいいなこれ。。
            if (isDup(checkedList,song.collectionId) === false){
              checkedList.push(song.collectionId)
              // dynamoDBに登録されていなかったら
              if (isRegistered(song.collectionId) === false){
                await putDynamo(song.collectionId,details)
                console.log('resisted ' + song.collectionId + " / " + song.collectionName)
              }
            }
          }
        })
      }
      
      offsetNum = offsetNum + offset    
      if (resp.resultCount === 0){
        endFlag = true
      }
      await sleep(5000);
    }
  }
}
  
main()
  .catch(function(val) { console.log(val) })

