import React, { FC, useState } from 'react';

import TextV3 from 'components/TextV3';

import CardRow from 'scenes/external/components/CardRow/CardRow';

import styles from './RawDataToggle.scss';

type IRawDataToggle = {
  label: string;
  value: string;
};

const RawDataToggle: FC<IRawDataToggle> = ({ label, value }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.container}>
      <button type="button" className={styles.toggle} aria-expanded={open} onClick={() => setOpen(prev => !prev)}>
        <TextV3.CaptionStrong extraStyles={styles.toggleText}>
          {open ? 'Hide raw data' : 'Show raw data'}
        </TextV3.CaptionStrong>
      </button>
      {open && <CardRow.Object label={label} value={value} />}
    </div>
  );
};

export default RawDataToggle;
