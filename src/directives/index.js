export const imgError = {
  inserted: (dom, options) => {
    dom.onerror = function() {
      dom.src = options.value
    }
  }
}

export const colorChange = {
  inserted: (dom, options) => {
    dom.style.color = options.value
  }
}
