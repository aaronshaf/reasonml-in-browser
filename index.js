// getscript

function getscript(uri, cb) {
  if (!uri) throw 'missing uri'
  var head = document.head || document.head.getElementsByTagName('head')[0]
  var el = document.createElement('script')
  el.type = 'text/javascript'
  if ('function' === typeof cb) {
    el.onerror = onerror.bind(null, uri, cb)
    el.onload = onload.bind(null, uri, cb)
  }
  head.appendChild(el)
  el.src = uri
}

function onerror(uri, cb, e) {
  cb(new URIError(e.target.src + ' could not be loaded'), e)
}

function onload(uri, cb, e) {
  cb(null, { uri: uri, event: e })
}

// end getscript

function evaluateReasonML(code) {
  const ast = window.parseRE(code)
  const ocaml = window.printML(ast)
  const result = window.ocaml.compile(ocaml)
  const js = JSON.parse(result).js_code
  eval(js)
}

getscript('https://reasonml.github.io/bs.js', function(err1, res) {
  if (err1) throw err1
  getscript('https://reasonml.github.io/refmt.js', function(err2, res) {
    if (err2) throw err2

    document.addEventListener('DOMContentLoaded', function() {
      Array.from(document.getElementsByTagName('script'))
        .filter(script => script.getAttribute('type') === 'text/reason')
        .forEach(script => {
          evaluateReasonML(script.innerHTML)
        })
    })
  })
})

window.exports = window.exports || {}
