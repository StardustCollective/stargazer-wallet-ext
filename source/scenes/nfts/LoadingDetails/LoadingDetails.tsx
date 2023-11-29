import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';

const LoadingDetails = (): JSX.Element => {
  return (
    <div>
      <Skeleton
        variant="rect"
        animation="wave"
        height={358}
        width={'100%'}
        style={{ borderRadius: 8 }}
      />
      <Skeleton
        variant="rect"
        animation="wave"
        height={20}
        width={200}
        style={{ marginTop: 16, marginBottom: 4 }}
      />
      <Skeleton variant="rect" animation="wave" height={20} width={100} />
    </div>
  );
};

export default LoadingDetails;
