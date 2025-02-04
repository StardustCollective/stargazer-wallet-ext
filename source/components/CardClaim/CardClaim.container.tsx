import React, { useEffect, useState, useRef, FC, memo } from 'react';
import { useSelector } from 'react-redux';
import userSelectors from 'selectors/userSelectors';
import { getAccountController } from 'utils/controllersUtils';
import { open } from 'utils/browser';
import { ELPACA_LEARN_MORE } from 'constants/index';
import { ToastPosition, ToastType, useToast } from 'context/ToastContext';
import CardClaim from './CardClaim';

const CLAIM_DELAY = 1 * 1000; // 1 second
const STATUS_CHECK_DELAY = 15 * 1000; // 15 seconds
const MAX_CLAIM_RETRIES = 2; // Maximum number of claim retries

const CardClaimContainer: FC<{ onPressHideCard: () => void }> = ({ onPressHideCard }) => {
  const { showToast } = useToast();

  const claimLoading = useSelector(userSelectors.getElpacaClaimLoading);
  const streak = useSelector(userSelectors.getElpacaStreak);
  const claim = useSelector(userSelectors.getElpacaClaim);

  const accountController = getAccountController();

  const [isClaimLoading, setIsClaimLoading] = useState(false);

  const statusCheckTimer = useRef<NodeJS.Timeout | null>(null);
  const initialAmount = useRef<number | null>(null);
  const statusRetries = useRef(0);
  const claimRetries = useRef(0);
  const claimSuccess = useRef(false);

  const cleanup = () => {
    if (statusCheckTimer.current) {
      clearTimeout(statusCheckTimer.current);
      statusCheckTimer.current = null;
    }
    initialAmount.current = 0;
    statusRetries.current = 0;
    claimRetries.current = 0;
  };

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  // Monitor claim hash changes
  useEffect(() => {
    if (claim?.hash) {
      // Clear transaction hash
      accountController.assetsController.clearClaimHash();

      // Store initial amount and reset status retries amount
      initialAmount.current = streak?.totalEarned || 0;
      statusRetries.current = 0;

      // Initial claim status check should happen after 10 seconds
      statusCheckTimer.current = setTimeout(() => {
        checkClaimStatus();
      }, STATUS_CHECK_DELAY);
    }
  }, [claim?.hash]);

  useEffect(() => {
    if (initialAmount.current === null || !streak?.totalEarned) return;

    // Validate totalEarned value:
    // If totalEarned > initialAmount -> transaction confirmed and UI should be updated
    if (streak.totalEarned > initialAmount.current && !claimSuccess.current) {
      claimSuccess.current = true;
      cleanup();
    }
  }, [streak?.totalEarned]);

  const checkClaimStatus = async () => {
    try {
      if (claimSuccess.current) return;

      await getElpacaInfo();

      // If we've exhausted status checks but have claim retries left, try claiming again
      if (claimRetries.current < MAX_CLAIM_RETRIES) {
        claimRetries.current += 1;
        statusRetries.current = 0;

        setTimeout(() => {
          handleClaim();
        }, CLAIM_DELAY);
      }
      // If we've exhausted all retries, show error and cleanup states
      else {
        showToast({
          type: ToastType.error,
          position: ToastPosition.bottom,
          title: `Oops! We couldn't claim your PACA`,
          message1: 'Please try again in a couple of minutes!',
        });
        setIsClaimLoading(false);
        cleanup();
      }
    } catch (error) {
      setIsClaimLoading(false);
      cleanup();
    }
  };

  useEffect(() => {
    if (!streak?.claimEnabled) {
      setIsClaimLoading(false);
    }
  }, [streak?.claimEnabled]);

  const handleClaim = async () => {
    if (claimSuccess.current) return;

    try {
      setIsClaimLoading(true);
      await accountController.assetsController.claimElpaca();
    } catch (err) {
      setIsClaimLoading(false);
      showToast({
        type: ToastType.error,
        position: ToastPosition.bottom,
        title: `We couldn't claim your PACA`,
        message1: 'Please try again in a couple of minutes!',
      });
    }
  };

  const getElpacaInfo = async (): Promise<void> => {
    try {
      await accountController.assetsController.fetchElpacaStreak();
    } catch (err) {
      showToast({
        type: ToastType.error,
        position: ToastPosition.bottom,
        title: `We couldn't get your PACA info`,
        message1: 'Please try again in a couple of minutes!',
      });
    }
  };

  const handleLearnMore = async () => {
    await open(ELPACA_LEARN_MORE);
  };

  if (!streak) return null;

  return (
    <CardClaim
      loading={claimLoading || isClaimLoading}
      currentStreak={streak.currentStreak}
      totalEarned={streak.totalEarned}
      amount={streak.claimAmount}
      currentClaimWindow={streak.currentClaimWindow}
      claimEnabled={streak.claimEnabled}
      showError={streak.showError}
      epochsLeft={streak.epochsLeft}
      handleClaim={handleClaim}
      handleLearnMore={handleLearnMore}
      handleHideCard={onPressHideCard}
    />
  );
};

export default memo(CardClaimContainer);
