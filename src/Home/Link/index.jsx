import React from 'react';
import PropTypes from 'prop-types';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import { CardHeader, withStyles } from '@material-ui/core';

const Link = ({ classes, imgSrc, label, onClick }) => {
  return (
    <Card className={classes.root} raised={false}>
      <CardActionArea onClick={onClick}>
        <CardHeader
          className={classes.header}
          title={label}
          classes={{ title: classes.title }}
        />
        <CardMedia className={classes.media} image={imgSrc} title={label} />
      </CardActionArea>
    </Card>
  );
};

Link.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Link.defaultProps = {
  label: '',
  onClick: () => {},
};

export default withStyles({
  root: {
    margin: '30px auto',
    maxWidth: '300px',
  },
  header: {
    backgroundColor: 'black',
  },
  title: {
    height: '18px',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  media: {
    height: '150px',
  },
})(Link);
