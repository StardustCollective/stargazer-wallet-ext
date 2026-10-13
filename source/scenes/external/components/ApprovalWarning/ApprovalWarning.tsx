import clsx from 'clsx';
import React, { FC } from 'react';

import { COLORS_ENUMS } from 'assets/styles/colors';

import TextV3 from 'components/TextV3';

import styles from './ApprovalWarning.scss';

export type ApprovalWarningSeverity = 'danger' | 'caution';

type IApprovalWarning = {
  severity: ApprovalWarningSeverity;
  children: React.ReactNode;
};

const ApprovalWarning: FC<IApprovalWarning> = ({ severity, children }) => {
  return (
    <div
      role="alert"
      data-testid="approval-warning"
      data-severity={severity}
      className={clsx(styles.container, styles[severity])}
    >
      <TextV3.CaptionStrong color={COLORS_ENUMS.BLACK} extraStyles={styles.text}>
        {children}
      </TextV3.CaptionStrong>
    </div>
  );
};

export default ApprovalWarning;
