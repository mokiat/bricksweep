import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const Header = ({ classes, isBackVisible, onBack }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onBackClicked = () => {
    if (onBack) {
      onBack(); // custom behavior
    } else {
      history.goBack(); // default behavior
    }
  };

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar>
        <div className={classes.bannerWrapper}>
          <a href="/">
            <img
              className={classes.banner}
              alt="logo"
              src="/images/banner.png"
            />
          </a>
        </div>
        {isBackVisible && (
          <Button
            className={classes.backButton}
            color="inherit"
            onClick={onBackClicked}
          >
            {t('Back')}
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  isBackVisible: PropTypes.bool,
  onBack: PropTypes.func,
};

Header.defaultProps = {
  isBackVisible: false,
};

export default withStyles({
  appBar: {
    backgroundColor: '#0075A3',
  },
  bannerWrapper: {
    textAlign: 'center',
    height: '64px',
    flexGrow: 1,
  },
  banner: {
    height: '64px',
  },
  backButton: {
    height: '64px',
  },
})(Header);
