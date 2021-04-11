import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import './index.css'
import App from './App'
import moment from 'moment'
import 'moment/locale/de'
import registerServiceWorker from './registerServiceWorker'
import { persistor, store } from './store/configureStore';
import { CircularProgress } from '@material-ui/core';
import { PersistGate } from 'redux-persist/lib/integration/react';

moment.locale('de')
console.log(moment().format("LLL"))


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={<CircularProgress />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>, document.getElementById('root'))
registerServiceWorker()
