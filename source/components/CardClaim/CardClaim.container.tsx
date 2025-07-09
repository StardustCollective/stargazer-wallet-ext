import React, { FC, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import userSelectors from 'selectors/userSelectors';
import CardClaim from './CardClaim';

const CardClaimContainer: FC<{ onPressHideCard: () => void }> = ({ onPressHideCard }) => {
  const streak = useSelector(userSelectors.getElpacaStreak);

  const handleWhatsNext = useCallback(() => {
    console.log('handleWhatsNext');
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
