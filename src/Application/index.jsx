import React from 'react';
import { BrowserRouter, Switch, Route, useParams } from 'react-router-dom';

import Browse from '../Browse';
import Home from '../Home';
import Tutorial from '../Tutorial';

const RoutedBrowse = () => {
  const { collection } = useParams();
  const path = `/sets/${encodeURIComponent(collection)}.json`;
  return <Browse src={path} />;
};

const Application = () => {
  // Note: The order of the Routes below matters.
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/tutorial">
          <Tutorial />
        </Route>
        <Route path="/browse/:collection">
          <RoutedBrowse />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Application;
