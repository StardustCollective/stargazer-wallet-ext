/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { withStyles } from '@material-ui/core/styles';

/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';

const ProgressStyles = () => ({
  root: {
    marginBottom: '20px',
  },
  colorPrimary: {
    backgroundColor: '#888888',
  },
  barColorPrimary: {
    backgroundColor: '#2b1d52',
  },
});

const PurpleLinearProgress = withStyles(ProgressStyles)(LinearProgress);

/////////////////////////
// Constants
/////////////////////////

// Props
const LINEAR_PROGRESS_VARIANT_PROP = 'determinate';
const LINEAR_PROGRESS_BOX_WIDTH = '100%';
const LINEAR_PROGRESS_BOX_MR = 1;
// Strings
const FETCHING_VIEW_LABEL_STRING = 'Loading accounts';

/////////////////////////
// Interface
/////////////////////////

interface ILabelProps {
  value: number;
}

interface IFetchingProps {
  accountsLoadProgress: number;
}

/////////////////////////
// Component
/////////////////////////

const FetchingProgress = (props: IFetchingProps) => {
  let { accountsLoadProgress } = props;

  function LinearProgressWithLabel(props: ILabelProps) {
    return (
      <>
        <span>
          {`${Math.round(props.value)}`}
          <span className={styles.percentage}>%</span>
        </span>
        <Box width={LINEAR_PROGRESS_BOX_WIDTH} mr={LINEAR_PROGRESS_BOX_MR}>
          <PurpleLinearProgress
            className={styles.progress}
            variant={LINEAR_PROGRESS_VARIANT_PROP}
            {...props}
          />
        </Box>
      </>
    );
  }

  return (
    <div className={styles.content}>
      <LinearProgressWithLabel value={accountsLoadProgress} />
      <Typography>{FETCHING_VIEW_LABEL_STRING}</Typography>
    </div>
  );
};

export default FetchingProgress;
