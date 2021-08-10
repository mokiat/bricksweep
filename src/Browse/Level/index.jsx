import { withStyles } from '@material-ui/core';

const Level = ({ classes, onClick }) => {
  return (
    <img
      className={classes.root}
      alt="level icon"
      src="/images/level_locked_default.png"
      onClick={onClick}
    />
  );
};

export default withStyles({
  root: {
    width: '48px',
    height: '48px',
  },
})(Level);
