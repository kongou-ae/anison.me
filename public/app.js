var addNewReleases = function (date) {

  var convertDate = function(date){
    var m = moment(date)
    return m.format('YYYY年MM月DD日 HH:mm:ss')
  }

  if (moment(date).isAfter(moment().subtract(3, 'days')) === true){
    return [
      m("i",{class:"tiny material-icons new_releases_icon"},"new_releases"),
      m("p",{class:"release-date"},convertDate(date)),
      ]
  } else {
    return m("p",{class:"release-date"},convertDate(date))
  }
}

// 配信日が3日以内だったらcardの色を変える
var changeColor = function(releaseDate){
  if (moment(releaseDate).isAfter(moment().subtract(3, 'days')) === true){
    return {class:"card horizontal red lighten-5"}
  } else {
    return {class:"card horizontal"}
  }
}

var maincomponent = {}

maincomponent.vm = {
  init: function(){
    
    maincomponent.vm.listAry = m.prop([])
    m.request({
      Method:"GET",
      url:"./anisonList.json",
    }).then(function(responce){
      for (var i = 0; i< responce.length; i++){
        maincomponent.vm.listAry().push(responce[i])
      }
    });
  }        
};

maincomponent.controller = function () {
  maincomponent.vm.init()
}

maincomponent.view = function(){
  return [
    m("nav",{class:"nav-extended"},[
      m("div",{class:"nav-wrapper"},[
        m("a[href=./]",{class:"brand-logo"},"Anison.me"),
        m("ul",{id:"nav-mobile",class:"right"},[
          m("li",[
            m("a[href=feed.xml]","feed")
          ])
        ])
      ]),
      m("div",{class:"nav-content"},[
        m("p",{class:"grey-text text-lighten-4"},"2時間ごとにiTunes Storeのアニソンをチェックします。2週間以内に配信された新曲のみ掲載します。")
      ])    
    ]),
    m("div",{class:"row"},[
      maincomponent.vm.listAry().map(function(data){
        return [
          m("div",{class:"col s12 m6 l4"},[
            m("div",changeColor(data.details.releaseDate),[
              m("div",{class:"card-image"},[
                m("img",{src:data.details.artworkUrl100})
              ]),
              m("div",{class:"card-stacked"},[
                m("div",{class:"card-content",id:data.details.collectionId},[
                  m("a[href=#" + data.details.collectionId + "]",[
                    m("p",{class:"collectionName truncate"},data.details.collectionName),
                  ]),
                  m("p",{class:"artistName truncate"},data.details.artistName),
                  addNewReleases(data.details.releaseDate)
                ]),
                m("div",{class:"card-action"},[
                  m("a[href="+ data.details.collectionViewUrl +"&app=itunes&at=1000lurX]",[
                    m("img",{src:"https://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_itunes-sm.svg"})                    
                  ]),
                  m("a[href="+ data.details.collectionViewUrl +"&at=1000lurX]",[
                    m("img",{src:"https://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_music-sm.svg",style:{height:"15px"}})                    
                  ])
                ]),
              ])          
            ])
          ])
        ]
      })
    ]),
    m("footer",{class:"page-footer"},[
      m("h5",{class:"white-text"},"Sorry"),
      m("p",{class:"grey-text text-lighten-4"},"offsetを使ってiTunes Search APIを叩いた結果が一意でないため、掲載している曲には抜け漏れや重複があります。あらかじめご了承ください。"),
      m("div",{class:"footer-copyright"},[
        m("div",{class:"container"},"© 2017 @kongou-ae")
      ])
    ])
  ]
}

m.mount(document.getElementById("mainComponent"), {
  controller: maincomponent.controller,
  view: maincomponent.view
});