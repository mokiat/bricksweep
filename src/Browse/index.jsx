import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import { CircularProgress, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import { navigate } from '../Utils';
import Frame from '../Frame';

import Level from './Level';

const Browse = ({ classes, src }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(src)
      .then((response) => response.json())
      .then((data) => {
        setCollection(data);
      })
      .catch((err) => {
        setCollection(null);
        console.log(`Failed to fetch level: ${err}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [src]);

  return (
    <Frame isBackVisible={true} onBack={() => navigate('/')}>
      {loading && <CircularProgress className={classes.loading} size="50px" />}
      {!loading && collection && (
        <>
          <div className={classes.titleHolder}>
            <Typography className={classes.title}>
              {t(collection.title)}
            </Typography>
          </div>
          <Grid
            className={classes.grid}
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            {collection.levels.map((level) => (
              <Grid key={level} item>
                <Level />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      {!loading && !collection && (
        <Alert className={classes.alert} severity="error">
          {t('Could not load required data. Please try again.')}
        </Alert>
      )}
    </Frame>
  );
};

Browse.propTypes = {
  src: PropTypes.string.isRequired,
};

Browse.defaultProps = {};

export default withStyles({
  titleHolder: {
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#0075A333',
    borderRadius: '3px',
    maxWidth: '300px',
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  grid: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '40px',
    maxWidth: '300px',
  },
  loading: {
    color: '#0075A3',
  },
})(Browse);
