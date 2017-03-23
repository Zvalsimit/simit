// api.js
function webApi() {
  return {
    getServicePrice :"api.kfw.net/flow/v1_0/price/getServicePrice",
    login : "api.kfw.net/flow/v1_0/user/pc/login"
  }
}

module.exports.webApi = webApi