import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

import { Logs } from 'expo';

// https://github.com/expo/expo/issues/2623#issuecomment-441364587
const isRemoteDebuggingEnabled = typeof atob !== 'undefined';
if (isRemoteDebuggingEnabled) {
  Logs.enableExpoCliLogging();
  Logs.disableExpoCliLogging();
} else {
  Logs.enableExpoCliLogging();
}


console.disableYellowBox = true;

const store = ConfigureStore();


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
      <Main />
    </Provider>
    );
  }
}