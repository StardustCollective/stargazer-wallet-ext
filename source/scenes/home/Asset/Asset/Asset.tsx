import React, { FC, useState } from 'react';
import clsx from 'clsx';
import { withStyles, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import QRCodeModal from 'components/QRCodeModal';
import TextV3 from 'components/TextV3';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArrowsActiveIcon from 'assets/images/svg/arrows-active.svg';
import ArrowsInactiveIcon from 'assets/images/svg/arrows-inactive.svg';
import GiftActiveIcon from 'assets/images/svg/gift-active.svg';
import GiftInactiveIcon from 'assets/images/svg/gift-inactive.svg';
import { AssetType } from 'state/vault/types';
import TxsPanel from '../TxsPanel';
import styles from './Asset.scss';
import IAssetSettings from './types';
import AssetButtons from '../AssetButtons';

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
      backgroundColor: '#7070FF',
    },
  },
})((props: any) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles(() =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#A3A3A3',
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 500,
      height: 48,
    },
    wrapper: {
      flexDirection: 'row',
      '& > img': {
        marginTop: 6,
        marginRight: 8,
      },
    },
    labelIcon: {
      paddingTop: 0,
      minHeight: 0,
    },
    selected: {
      color: '#fff',
      fontWeight: 600,
    },
  })
)((props: any) => <Tab disableRipple {...props} />);

const AssetDetail: FC<IAssetSettings> = ({
  activeWallet,
  activeAsset,
  activeNetwork,
  balanceText,
  fiatAmount,
  showQrCode,
  onSendClick,
  setShowQrCode,
  assets,
  isAddressCopied,
  copyAddress,
  showFiatAmount,
}) => {
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
            <div className={styles.balance}>
              <TextV3.HeaderDisplay dynamic extraStyles={styles.balanceText}>
                {balanceText}{' '}
              </TextV3.HeaderDisplay>
              <TextV3.Body extraStyles={styles.symbolText}>
                {assets[activeAsset?.id]?.symbol}
              </TextV3.Body>
            </div>
            {showFiatAmount && (
              <div className={styles.fiatBalance}>
                <TextV3.Body extraStyles={styles.fiatText}>{fiatAmount}</TextV3.Body>
              </div>
            )}
            <div className={styles.actions}>
              <AssetButtons
                setShowQrCode={setShowQrCode}
                onSendClick={onSendClick}
                assetId={activeAsset?.id}
              />
            </div>
          </section>
          <QRCodeModal
            open={showQrCode}
            onClose={() => setShowQrCode(false)}
            address={activeAsset.address}
            asset={assets[activeAsset?.id]}
            textTooltip={textTooltip}
            copyAddress={copyAddress}
            activeNetwork={activeNetwork}
          />
          {showRewardsTab ? (
            <>
              <StyledTabs
                value={routeIndex}
                onChange={handleChange}
                variant="fullWidth"
                aria-label="full width tabs"
              >
                <StyledTab
                  label="Transactions"
                  icon={
                    <img
                      src={`/${routeIndex === 0 ? ArrowsActiveIcon : ArrowsInactiveIcon}`}
                      alt="arrows"
                    />
                  }
                />
                <StyledTab
                  label="Rewards"
                  icon={
                    <img
                      src={`/${routeIndex === 1 ? GiftActiveIcon : GiftInactiveIcon}`}
                      alt="gift"
                    />
                  }
                />
              </StyledTabs>
              <TabPanel value={routeIndex} index={0}>
                <TxsPanel route="transactions" />
              </TabPanel>
              <TabPanel value={routeIndex} index={1}>
                <TxsPanel route="rewards" />
              </TabPanel>
            </>
          ) : (
            <TxsPanel route="transactions" />
          )}
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
