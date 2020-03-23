import React, { useContext } from 'react';
import { AuthContext } from './context/auth-context';
import Auth from './components/Auth';
import Ingredients from './components/Ingredients/Ingredients';

const App = props => {
  const authContext = useContext(AuthContext);
  return authContext.authenticated ? <Ingredients /> : <Auth />;
};

export default App;
