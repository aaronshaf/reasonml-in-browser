// getscript
// https://www.npmjs.com/package/getscript
// license: MIT

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
  const outputDiv = document.querySelector('#compiled-javascript')
  if (outputDiv) {
    outputDiv.textContent = js
  }
  eval(js)
}

document.addEventListener('DOMContentLoaded', () => {
  getscript('https://reasonml.github.io/js/bs.js', (err1, res) => {
    if (err1) throw err1
    getscript('https://reasonml.github.io/js/refmt.js', (err2, res) => {
      if (err2) throw err2

      getscript(
        'https://reasonml.github.io/js/stdlibBundle.js',
        (err3, res) => {
          if (err3) throw err3
          main()
        }
      )
    })
  })
})

window.exports = window.exports || {}

function main() {
  let errorTimerId

  const workerScript = `
    importScripts('https://reasonml.github.io/js/stdlibBundle.js')

    const _console = console
    
    const stringify = value => JSON.stringify(value) || String(value)
    
    const send = (type, contents) => postMessage({ type, contents })
    
    const log = (type, items) => send(type, items.map(stringify))
    
    console = {
      log: (...items) => log('log', items),
      error: (...items) => log('error', items),
      warn: (...items) => log('warn', items)
    }
    
    onmessage = ({ data }) => {
      eval(data.code)
      send('end', data.timerId)
    }
  `
  const blob = new Blob([workerScript], { type: 'application/javascript' })
  const evalWorker = new Worker(URL.createObjectURL(blob))
  evalWorker.onmessage = ({ data }) => {
    if (data.type === 'end') {
      clearTimeout(data.contents)
    } else {
      console.debug(data)
    }
  }

  Array.from(document.getElementsByTagName('script'))
    .filter(script => script.getAttribute('type') === 'text/reason')
    .forEach(script => {
      evaluateReasonML(script.innerHTML)
    })
}
