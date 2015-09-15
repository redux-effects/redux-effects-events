/**
 * Vars
 */

const HANDLE_EVENT = 'HANDLE_EVENT'
const UNHANDLE_EVENT = 'UNHANDLE_EVENT'
const docEvents = ['DOMContentLoaded', 'click']

/**
 * Events
 */

function eventMiddleware ({wnd = window, doc = document}) {
  const map = {}
  const idGen = idGenerator()

  return ({dispatch, getState}) => next => action =>
    action.type === HANDLE_EVENT || action.type === UNHANDLE_EVENT
      ? Promise.resolve(handle(dispatch, action))
      : next(action)

  function handle (dispatch, action) {
    let {id, event, cb, once} = action.payload
    const el = isDocEvent(event) ? doc : wnd

    switch (action.type) {
      case HANDLE_EVENT:
        id = idGen()
        let fn = compose(dispatch, cb)

        if (once) {
          fn = e => {
            dispatch(cb(e))
            dispatch({type: UNHANDLE_EVENT, payload: {id, event}})
          }
        }

        if (event === 'domready') {
          const hack = doc.documentElement.doScroll
          if ((hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)) {
            fn()
            return
          }

          event = 'DOMContentLoaded'
        }

        el.addEventListener(event, fn)
        map[id] = fn
        return id
      case UNHANDLE_EVENT:
        el.removeEventListener(event, map[id])
        delete map[id]
        return
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
