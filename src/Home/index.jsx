import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid } from '@material-ui/core';

import Frame from '../Frame';
import { navigate } from '../Utils';

import Tile from './Tile';
import { withStyles } from '@material-ui/core';

const HomeScreen = ({ classes }) => {
  const { t } = useTranslation();

  return (
    <Frame isBackVisible={false}>
      <Grid
        className={classes.grid}
        container
        direction="row"
        justifyContent="center"
        alignItems="flex-start"
        spacing={2}
      >
        <Grid item>
          <Tile
            title={t('Play random level')}
            icon="/images/icon-random.png"
            onClick={() => alert('Random')}
          />
        </Grid>

        <Grid item>
          <Tile
            title={t('Watch video lesson')}
            icon="/images/icon-tutorial.png"
            onClick={() => navigate('/tutorial')}
          />
        </Grid>

        <Grid item>
          <Tile
            title={t('Play 3 by 3')}
            icon="/images/icon-3x3.png"
            onClick={() => navigate('/browse/3x3')}
          />
        </Grid>

        <Grid item>
          <Tile
            title={t('Play 4 by 3')}
            icon="/images/icon-4x3.png"
            onClick={() => navigate('/browse/4x3')}
          />
        </Grid>
      </Grid>
    </Frame>
  );
};

export default withStyles({
  grid: {
    maxWidth: '480px',
    margin: 'auto',
  },
})(HomeScreen);
