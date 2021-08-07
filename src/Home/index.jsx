import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { Container } from '@material-ui/core';

import Header from '../Header';
import Link from './Link';

const HomeScreen = () => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <>
      <Header isBackVisible={false} />
      <Container maxWidth="sm">
        <Link
          imgSrc="/images/button-tutorial.png"
          label={t('Watch Tutorial')}
          onClick={() => {
            history.push('/tutorial');
          }}
        />

        <Link
          imgSrc="/images/button-play3x3.png"
          label={t('Play 3 x 3')}
          onClick={() => {
            history.push('/selection/3x3');
          }}
        />

        <Link
          imgSrc="/images/button-play4x3.png"
          label={t('Play 4 x 3')}
          onClick={() => {
            history.push('/selection/4x3');
          }}
        />
      </Container>
    </>
  );
};

export default HomeScreen;
