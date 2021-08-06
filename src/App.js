import { useTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import logo from './logo.svg';
import './App.css';

const App = ({ classes }) => {
  const { t } = useTranslation();

  return (
    <div className={classes.holder}>
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <img className={classes.banner} alt="logo" src="/images/banner.png" />
          <Button className={classes.backButton} color="inherit">
            {t('Back')}
          </Button>
        </Toolbar>
      </AppBar>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </div>
  );
};

export default withStyles({
  holder: {
    backgroundColor: 'red',
  },
  appBar: {
    backgroundColor: '#0075A3',
  },
  banner: {
    height: '64px',
  },
  backButton: {
    height: '64px',
  },
})(App);
