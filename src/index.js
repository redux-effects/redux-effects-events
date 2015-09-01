/**
 * Vars
 */

const types = {
  RESIZE: 'resize',
  SCROLL: 'scroll',
  POPSTATE: 'popstate',
  UNLOAD: 'unload',
  LOAD: 'load',
  BEFORE_UNLOAD: 'beforeunload',
  DOM_CONTENT_LOADED: 'DOMContentLoaded'
}

const docEvents = ['DOMContentLoaded']

/**
 * Events
 */

function eventMiddleware ({wnd=window, doc=document}) {
  const map = {}
  const idGen = idGenerator()

  return ({dispatch, getState}) => next => effect =>
    types.hasOwnProperty(effect.type)
      ? handle(dispatch, effect)
      : next(effect)

  function handle (dispatch, effect) {
    if (effect.type.slice(3) !== 'OFF') {
      const evt = types[effect.type]
      const el = isDocEvent(evt) ? doc : wnd
      const fn = compose(dispatch, effect.cb)
      const id = idGen()

      el.addEventListener(evt, fn)
      map[id] = fn
      return id
    } else {
      const evt = types[effect.type.slice(3)]
      const el = isDocEvent(evt) ? doc : wnd
      const id = effect.value

      el.removeEventListener(evt, map[id])
      delete map[id]
    }
  }
}

function isDocEvent (evt) {
  return docEvents.indexOf(evt) !== -1
}

function idGenerator () {
  let id = 0
  return () => id++
}

function compose (...fns) {
  return fns.reduce((memo, fn) => arg => memo(fn(arg)), arg => arg)
}

/**
 * Exports
 */

export default eventMiddleware
