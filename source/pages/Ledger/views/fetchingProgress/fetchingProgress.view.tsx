/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

/////////////////////////
// Styles Imports
/////////////////////////

import styles from './styles.module.scss';

/////////////////////////
// Constants
/////////////////////////

// Props
const BOX_DISPLAY_PROP = 'flex'
const BOX_ALIGN_ITEMS_PROP = 'center'
const LINEAR_PROGRESS_VARIANT_PROP = 'determinate';
const LINEAR_PROGRESS_BOX_WIDTH = '83%';
const LINEAR_PROGRESS_BOX_MR = 1;
const PERCENTAGE_BOX_MIN_WIDTH_PROP = 35;
const PERCENTAGE_TYPOGRAPHY_VARIANT_PROP = 'body2';
const PERCENTAGE_TYPOGRAPHY_COLOR_PROP = 'textSecondary';
// Strings
const FETCHING_VIEW_LABEL_STRING = 'Loading Accounts...';

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

  let {
    accountsLoadProgress
  } = props;

  function LinearProgressWithLabel(props: ILabelProps) {
    return (
      <Box display={BOX_DISPLAY_PROP} alignItems={BOX_ALIGN_ITEMS_PROP}>
        <Box width={LINEAR_PROGRESS_BOX_WIDTH} mr={LINEAR_PROGRESS_BOX_MR}>
          <LinearProgress variant={LINEAR_PROGRESS_VARIANT_PROP} {...props} />
        </Box>
        <Box minWidth={PERCENTAGE_BOX_MIN_WIDTH_PROP}>
          <Typography variant={PERCENTAGE_TYPOGRAPHY_VARIANT_PROP} color={PERCENTAGE_TYPOGRAPHY_COLOR_PROP}>
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <div className={styles.fetchingView}>
      <Typography>{FETCHING_VIEW_LABEL_STRING}</Typography>
      <LinearProgressWithLabel value={accountsLoadProgress} />
    </div>
  );

}

export default FetchingProgress;