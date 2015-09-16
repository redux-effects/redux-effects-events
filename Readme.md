
# redux-effects-events

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Setup event listeners for various things

## Installation

    $ npm install redux-effects-events

## Usage

Provides access to event listeners on `window` and `document`.  Right now the library itself decides which events go where, you cannot specify.  Currently `click` and `DOMContentLoaded` go on `document` and all others go on `window`.

Unbinding handlers works similarly to `setTimeout`/`setInterval`.  Binding a handler will return an id to your composed effect handlers.  You can store that id, and then use it to unbind your handler later:

```javascript
import listen from 'declarative-events'
import bind from 'bind-effect'
import {createAction} from 'redux-actions'

function initialize () {
  return bind(listen('DOMContentLoaded', loadApp), boundLoadedListener)
}

const loadApp = createAction('LOAD_APP')
const boundLoadedListener = createAction('BOUND_LOADED_LISTENER')
const clearLoadedListener = createAction('CLEAR_LOADED_LISTENER')

// ... In your state reducers...

function reduce (state, action) {
  if (action.type === 'BOUND_LOADED_LISTENER') {
    return {...state, loadedListenerId: action.payload}
  } else if (action.type === 'CLEAR_LOADED_LISTENER') {
    return {...state, loadedListenerId: null}
  } else if (action.type === 'LOAD_APP') {
    return {...state, loaded: true}
  }
}

// ... In your main app...

function onStateChange (state) {
  if (state.loaded && state.loadedListenerId) {
    dispatch(clearLoadedListenerId())
  }
}
```

## License

The MIT License

Copyright &copy; 2015, Weo.io &lt;info@weo.io&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
