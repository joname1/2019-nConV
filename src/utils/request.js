//全局路径
// const commonUrl = 'https://naives.glitch.me'
const commonUrl = 'https://wvvw-3nwdsllu8.now.sh'

//解析json
function parseJSON(response) {
  return response.json()
}
//检查请求状态
function checkStatus(response) {
  if (response.status >= 200 && response.status < 500) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

export default function request(info) {
  let url = info.url, data = info.data

  if (info.method === 'get') {
    let paramsArray = [];
    Object.keys(data).forEach(key => paramsArray.push(key + '=' + data[key]))
    if (url.search(/\?/) === -1) {
      url += '?' + paramsArray.join('&')
    } else {
      url += '&' + paramsArray.join('&')
    }
  }
  
  return fetch(commonUrl + url, data)
    .then(checkStatus)
    .then(parseJSON)
    .catch(err => ({ err }))
}