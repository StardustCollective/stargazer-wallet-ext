import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { withStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import QRCodeModal from 'components/QRCodeModal';
import Sheet from 'components/Sheet';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { AssetType } from 'state/vault/types';
import TxsPanel from '../TxsPanel';
import TextV3 from 'components/TextV3';
import styles from './Asset.scss';
import IAssetSettings from './types';
import Balance from '../Balance';

const TabPanel: FC<any> = (props) => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
};

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    height: 6,
    backgroundColor: 'transparent',
    '& > span': {
      width: '100%',
      backgroundColor: '#775AED',
    },
  },
})((props: any) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles(() =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#FFFFFFA8',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 600,
      height: 48,
    },
    wrapper: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    selected: {
      background: 'linear-gradient(180deg, rgba(119, 90, 237, 0.00) 0%, rgba(119, 90, 237, 0.16) 88.39%)',
      color: '#fff',
      fontWeight: 600,
    },
  })
)((props: any) => <Tab disableRipple {...props} />);

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  balanceText,
  fiatAmount,
  lockedBalanceText,
  fiatLocked,
  showQrCode,
  showLocked,
  showBuy,
  onSend,
  onBuy,
  onReceive,
  setShowQrCode,
  assets,
  isAddressCopied,
  copyAddress,
  showFiatAmount,
}) => {
  const [isLockedInfoOpen, setIsLockedInfoOpen] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);
  const textTooltip = isAddressCopied ? 'Copied' : 'Copy Address';
  const showRewardsTab = activeAsset?.type === AssetType.Constellation;

  const handleChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setRouteIndex(newValue);
  };

  return (
    <div className={styles.wrapper}>
      {!!activeWallet && !!activeAsset ? (
        <>
          <section className={styles.center}>
           <Balance.Root>
              <Balance.Header>
                <Balance.Available />
              </Balance.Header>
              <Balance.Content>
                <Balance.TokenAmount amount={balanceText} />
                {showFiatAmount && <Balance.FiatAmount amount={fiatAmount} />}
              </Balance.Content>
              <Balance.Footer>
                {showBuy && <Balance.Buy  onPress={onBuy} />}
                <Balance.Send  onPress={onSend} />
                <Balance.Receive  onPress={onReceive} />
              </Balance.Footer>
            </Balance.Root>
            {showLocked && 
              <div className={styles.lockedBalance}>
                <Balance.Root>
                  <Balance.Header>
                    <Balance.Locked  onInfoPress={() => setIsLockedInfoOpen(true)}/>
                  </Balance.Header>
                  <Balance.Content>
                    <Balance.TokenAmount amount={lockedBalanceText} />
                    {showFiatAmount && <Balance.FiatAmount amount={fiatLocked} />}
                  </Balance.Content>
                </Balance.Root>
              </div>
            }
          </section>
          <QRCodeModal
            open={showQrCode}
            onClose={() => setShowQrCode(false)}
            address={activeAsset.address}
            asset={assets[activeAsset?.id]}
            textTooltip={textTooltip}
            copyAddress={copyAddress}
          />
          {showRewardsTab ? (
            <>
              <StyledTabs
                value={routeIndex}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="full width tabs"
              >
                <StyledTab label="Transactions" />
                <StyledTab label="Actions" />
                <StyledTab label="Rewards" />
              </StyledTabs>
              <TabPanel value={routeIndex} index={0}>
                <TxsPanel route="transactions" />
              </TabPanel>
              <TabPanel value={routeIndex} index={1}>
                <TxsPanel route="actions" />
              </TabPanel>
              <TabPanel value={routeIndex} index={2}>
                <TxsPanel route="rewards" />
              </TabPanel>
            </>
          ) : (
            <TxsPanel route="transactions" />
          )}
          <Sheet
            isVisible={isLockedInfoOpen}
            onClosePress={() => setIsLockedInfoOpen(false)}
            snaps={[280]}
            title={{
              label: 'Locked Balance',
              align: 'left',
            }}
          >
            <TextV3.Body extraStyles={styles.lockedInfoText}>Tokens you can’t move right now due to actions like ‘AllowSpend’ or ‘TokenLock’. AllowSpend pre-approves another wallet to spend tokens for you.</TextV3.Body>
            <TextV3.Body extraStyles={styles.lockedInfoText}>TokenLock freezes them temporarily, often for staking or governance. The tokens stay in your wallet but can’t be used until unlocked.</TextV3.Body>
          </Sheet>
        </>
      ) : (
        <section
          className={clsx(styles.mask, {
            [styles.hide]: activeAsset,
          })}
        >
          <CircularProgress className={styles.loader} />
        </section>
      )}
    </div>
  );
};

export default AssetDetail;
