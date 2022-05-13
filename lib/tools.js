window.tools = (() => {
  function queryString() {
    return window.location.search.replace('?', '')
      .split('&')
      .reduce(function (res, item) {
        let kv = item.split('=');
        res[kv[0]] = kv[1];
        return res;
      }, {})
  }
  
  function sha256 (value) {
    return CryptoJS.SHA256(CryptoJS.enc.Utf8.parse(value));
  }
  return {
    queryString,
    sha256,
  }
})();