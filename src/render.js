const Chromy = require('chromy')
const fse = require('fs-extra')

require('babel-polyfill');

let main = async () => {
  const chromy = new Chromy()
  await chromy.blockUrls(['*.png', '*.jpg', '*.jpeg', '*.gif'])
  await chromy.goto('https://i.anison.me/spa.html')
  await chromy.sleep(10000)
  const result = await chromy.evaluate(() => {
    let html = '<html>' + document.getElementsByTagName('html')[0].innerHTML + '</html>';
    html = html.replace(/<script src=".\/app.js"><\/script>/,'')
    return html
  })
  await chromy.close()
  await fse.outputFile('public/index.html', result)
}

main()
