import React from 'react';
import PropTypes from 'prop-types';

import { Typography, withStyles } from '@material-ui/core';

const Tile = ({ classes, title, icon, onClick }) => {
  return (
    <div className={classes.root}>
      <Typography className={classes.title}>{title}</Typography>
      <div className={classes.tile} onClick={onClick}>
        <img className={classes.icon} alt={title} src={icon} />
      </div>
    </div>
  );
};

Tile.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

Tile.defaultProps = {
  onClick: () => {},
};

export default withStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    display: 'block',
    marginBottom: '5px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  tile: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    width: '150px',
    height: '150px',
    backgroundImage: 'url("/images/tile-default.png")',
    backgroundSize: 'cover',
    '&:hover': {
      backgroundImage: 'url("/images/tile-hover.png")',
    },
    '&:active': {
      backgroundImage: 'url("/images/tile-active.png")',
    },
  },
  icon: {
    display: 'block',
    margin: 'auto auto',
  },
})(Tile);
