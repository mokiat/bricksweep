import { useTranslation } from 'react-i18next';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
      <p>TODO</p>
    </div>
  );
};

export default withStyles({
  holder: {},
  appBar: {
    backgroundColor: '#0075A3',
  },
  banner: {
    pointerEvents: 'none',
    height: '64px',
  },
  backButton: {
    height: '64px',
  },
})(App);
