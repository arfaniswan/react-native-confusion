import React from 'react';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

import { Logs } from 'expo';
import { PersistGate } from 'redux-persist/es/integration/react'
import { Loading } from './components/LoadingComponent';

const { persistor, store } = ConfigureStore();


// https://github.com/expo/expo/issues/2623#issuecomment-441364587
const isRemoteDebuggingEnabled = typeof atob !== 'undefined';
if (isRemoteDebuggingEnabled) {
  Logs.enableExpoCliLogging();
  Logs.disableExpoCliLogging();
} else {
  Logs.enableExpoCliLogging();
}


console.disableYellowBox = true;



export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
      <PersistGate 
        loading={<Loading />}
        persistor={persistor}>
        <Main />
      </PersistGate>
    </Provider>
    );
  }
}