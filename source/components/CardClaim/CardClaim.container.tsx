import React, { FC, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import userSelectors from 'selectors/userSelectors';
import CardClaim from './CardClaim';
import { open } from 'utils/browser';
import { WHATS_NEXT_URL } from './constants';

const CardClaimContainer: FC<{ onPressHideCard: () => void }> = ({ onPressHideCard }) => {
  const streak = useSelector(userSelectors.getElpacaStreak);

  const handleWhatsNext = useCallback(() => {
    open(WHATS_NEXT_URL);
  }, []);

  const totalEarned = streak !== null ? streak.totalEarned : null;

  return (
    <CardClaim
      totalEarned={totalEarned}
      handleWhatsNext={handleWhatsNext}
      handleHideCard={onPressHideCard}
    />
  );
};

export default memo(CardClaimContainer);
