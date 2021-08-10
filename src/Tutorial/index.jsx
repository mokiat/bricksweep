import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import { navigate } from '../Utils';
import Frame from '../Frame';

const Tutorial = ({ classes }) => {
  return (
    <Frame isBackVisible={true} onBack={() => navigate('/')}>
      <div className={classes.container}>
        <iframe
          title="tutorial"
          width="600"
          height="480"
          frameBorder="0"
          src="https://www.youtube.com/embed/r_8wmoqfqeI?rel=0&enablejsapi=1"
          allowscriptaccess="always"
          allowFullScreen
        ></iframe>
      </div>
    </Frame>
  );
};

export default withStyles({
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '600px',
  },
})(Tutorial);
