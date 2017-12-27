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

    Array.from(document.getElementsByTagName('script'))
      .filter(script => script.getAttribute('type') === 'text/reason')
      .forEach(script => {
        evaluateReasonML(script.innerHTML)
      })
  })
})
