/**
 * Imports
 */

import test from 'tape'
import events from '../src'

/**
 * Tests
 */

test('should work', ({pass, end}) => {
  const wnd = new Wnd()
  const doc = new Wnd()
  const mw = events({wnd, doc})({dispatch: () => {}, getState: () => {}})(() => {})

  mw({type: 'HANDLE_LOAD', cb: () => pass()})
  wnd.emit('load')
  end()
})

/**
 * Mock window class
 */

class Wnd {
  constructor () {
    this.events = {}
  }

  addEventListener (evt, fn) {
    this.events[evt] = this.events[evt] || []
    this.events[evt].push(fn)
  }

  emit (evt, e) {
    (this.events[evt] || []).forEach(fn => fn(e))
  }
}
