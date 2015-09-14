/**
 * Vars
 */

const types = {
  HANDLE_CLICK: 'click',
  HANDLE_RESIZE: 'resize',
  HANDLE_SCROLL: 'scroll',
  HANDLE_POPSTATE: 'popstate',
  HANDLE_UNLOAD: 'unload',
  HANDLE_LOAD: 'load',
  HANDLE_BEFORE_UNLOAD: 'beforeunload',
  HANDLE_DOM_CONTENT_LOADED: 'DOMContentLoaded',
  HANDLE_DOM_READY: 'DOMContentLoaded'
}

const docEvents = ['DOMContentLoaded', 'click']
const typeList = Object.keys(types).reduce((memo, type) => memo.concat([type, 'UN' + type]), [])

/**
 * Events
 */

function eventMiddleware ({wnd = window, doc = document}) {
  const map = {}
  const idGen = idGenerator()

  return ({dispatch, getState}) => next => action =>
    typeList.indexOf(action.type) !== -1
      ? Promise.resolve(handle(dispatch, action))
      : next(action)

  function handle (dispatch, action) {
    if (action.type.slice(0, 2) !== 'UN') {
      const fn = compose(dispatch, action.payload.cb)

      if (action.type === 'HANDLE_DOM_READY') {
        const hack = doc.documentElement.doScroll
        if ((hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)) {
          fn()
          return
        }
      }

      const evt = types[action.type]
      const el = isDocEvent(evt) ? doc : wnd
      const id = idGen()

      el.addEventListener(evt, fn)
      map[id] = fn

      return id
    } else {
      const evt = types[action.type.slice(0, 2)]
      const el = isDocEvent(evt) ? doc : wnd
      const id = action.payload.value

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
