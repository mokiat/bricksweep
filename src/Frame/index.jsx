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
      <AppBar className={classes.header} position="fixed" title={'Hello'}>
        <Toolbar>
          <a href="/" className={classes.banner}>
            <img alt="logo" src="/images/banner.png" />
          </a>
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

      <Container className={classes.container} maxWidth="md">
        {children}
      </Container>

      <AppBar className={classes.footer} position="fixed">
        <Toolbar>
          <Grid container justifyContent="space-between" spacing={1}>
            <Link className={classes.link} href="http://mokiat.com">
              {t('Created by mokiat')}
            </Link>
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
    justifyContent: 'center',
    backgroundColor: '#0075A3',
  },
  banner: {
    height: '50px',
    flexGrow: 1,
    textAlign: 'center',
    margin: '4px',
    '& img': {
      maxHeight: '100%',
    },
  },
  container: {
    marginTop: '58px',
    marginBottom: '58px',
    paddingTop: '58px',
    paddingBottom: '58px',
    textAlign: 'center',
    '@media only screen and (max-width: 768px)': {
      paddingTop: '20px',
      paddingBottom: '20px',
    },
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
