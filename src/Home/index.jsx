import React from 'react';
import { useTranslation } from 'react-i18next';

import { Grid } from '@material-ui/core';

import Frame from '../Frame';
import { navigate } from '../Utils';

import Link from './Link';

const HomeScreen = () => {
  const { t } = useTranslation();

  return (
    <Frame isBackVisible={false}>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Link
            imgSrc="/images/button-tutorial.png"
            label={t('Watch Tutorial')}
            onClick={() => navigate('/tutorial')}
          />
        </Grid>

        <Grid item>
          <Link
            imgSrc="/images/button-play3x3.png"
            label={t('Play 3 x 3')}
            onClick={() => navigate('/browse/3x3')}
          />
        </Grid>

        <Grid item>
          <Link
            imgSrc="/images/button-play4x3.png"
            label={t('Play 4 x 3')}
            onClick={() => navigate('/browse/4x3')}
          />
        </Grid>
      </Grid>
    </Frame>
  );
};

export default HomeScreen;
