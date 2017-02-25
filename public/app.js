var convertDate = function(date){
  var m = moment(date)
  return m.format('YYYY年MM月DD日 HH:mm:ss')
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
    m("div",{class:"row"},[
      maincomponent.vm.listAry().map(function(data){
        return [
          m("div",{class:"col s12 m6 l4"},[
            m("div",{class:"card horizontal"},[
              m("div",{class:"card-image"},[
                m("img",{src:data.artworkUrl100})
              ]),
              m("div",{class:"card-stacked"},[
                m("div",{class:"card-content"},[
                  m("p",{class:"collectionName truncate"},data.collectionName),
                  m("p",{class:"artistName truncate"},data.artistName),
                  m("p",convertDate(data.releaseDate))
                ]),
                m("div",{class:"card-action"},[
                  m("a[href="+ data.collectionViewUrl +"&app=itunes&at=1000lurX]",[
                    m("img",{src:"https://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_itunes-sm.svg"})                    
                  ]),
                  m("a[href="+ data.collectionViewUrl +"&at=1000lurX]",[
                    m("img",{src:"https://linkmaker.itunes.apple.com/images/badges/ja-jp/badge_music-sm.svg",style:{height:"15px"}})                    
                  ])
                ]),
              ])          
            ])
          ])
        ]
      })
    ])
  ]
}

m.mount(document.getElementById("mainComponent"), {
  controller: maincomponent.controller,
  view: maincomponent.view
});