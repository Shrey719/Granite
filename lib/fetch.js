import request from 'request'

function csfetch(url, callback) {
  const options = {
    url,
    headers: {
        // we do a minor amount of trolling
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36', 
    },
  };

  request(options, (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      callback(new Error(`Failed w/ status code ${response.statusCode}`), null);
    } else {
      callback(null, body);
    }
  });
}

export default csfetch