import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../Home';
import Tutorial from '../Tutorial';

const Application = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* The order of the Routes matters! */}
        <Route path="/tutorial">
          <Tutorial />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Application;
