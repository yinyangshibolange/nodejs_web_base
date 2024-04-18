const ejs = require("ejs")
module.exports = function (ejsString, htmlConfig, urlIndex, data) {
   try {
    return ejs.render(ejsString, data)
   } catch(err) {
    throw err
   }
 }

