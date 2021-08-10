import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { Container, Grid, Link, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const Frame = ({ classes, children, isBackVisible, onBack }) => {
  const { t } = useTranslation();

  return (
    <>
      <AppBar className={classes.header} position="fixed">
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
              onClick={onBack}
            >
              {t('Back')}
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container className={classes.container}>{children}</Container>

      <AppBar className={classes.footer} position="fixed">
        <Toolbar>
          <Grid container justifyContent="space-between" spacing={1}>
            <Typography>{t('Created by Momchil Atanasov')}</Typography>
            <Link
              className={classes.link}
              href="https://github.com/mokiat/bricksweep"
            >
              {t('Source Code')}
            </Link>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

Frame.propTypes = {
  isBackVisible: PropTypes.bool,
  onBack: PropTypes.func,
};

Frame.defaultProps = {
  isBackVisible: false,
  onBack: () => {},
};

export default withStyles({
  header: {
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
  container: {
    paddingTop: '100px',
    paddingBottom: '100px',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#000000',
    top: 'auto',
    bottom: 0,
  },
  link: {
    color: 'white',
  },
})(Frame);
