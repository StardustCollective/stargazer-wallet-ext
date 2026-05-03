/**
 * Connect Screen (Deep Link)
 *
 * This screen is shown when a dApp requests to connect via deep link.
 * It displays the origin (dApp domain) and the list of DAG accounts,
 * allowing the user to approve or reject the connection.
 *
 * Deep link format: stargazer://connect?callback=...&request_id=...
 */

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import { COLORS_ENUMS } from 'assets/styles/colors';

import ButtonV3, { BUTTON_SIZES_ENUM, BUTTON_TYPES_ENUM } from 'components/ButtonV3';
import TextV3, { TEXT_ALIGN_ENUM } from 'components/TextV3';
import TextInput from 'components/TextInput';

import walletsSelectors from 'selectors/walletsSelectors';
import { getWalletController } from 'utils/controllersUtils';

const passwordSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
});

type ConnectParams = {
  callbackUrl?: string;
  requestId?: string;
  origin?: string;
};

const truncateAddress = (address: string, startChars = 8, endChars = 6): string => {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

const redirectToCallback = async (
  callbackUrl: string,
  requestId: string,
  status: 'success' | 'rejected',
  accounts?: string[]
) => {
  const params: string[] = [
    `request_id=${encodeURIComponent(requestId)}`,
    `status=${encodeURIComponent(status)}`,
  ];

  if (status === 'success' && accounts) {
    params.push(`accounts=${encodeURIComponent(accounts.join(','))}`);
  } else if (status === 'rejected') {
    params.push('error=user_rejected');
  }

  const separator = callbackUrl.includes('?') ? '&' : '?';
  const finalUrl = callbackUrl + separator + params.join('&');

  await Linking.openURL(finalUrl);
};

const Connect = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: ConnectParams }, 'params'>>();
  const [loading, setLoading] = useState(false);
  const [unlockError, setUnlockError] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const { callbackUrl, requestId, origin } = route.params || {};
  const walletController = getWalletController();

  useEffect(() => {
    setIsUnlocked(walletController.isUnlocked());
    setLoading(false);
    setUnlockError(false);
  }, [requestId]);

  const { control, handleSubmit, errors } = useForm({
    validationSchema: passwordSchema,
  });

  const handleUnlock = async (data: any) => {
    setUnlockLoading(true);
    setUnlockError(false);
    try {
      await walletController.unLock(data.password);
      setIsUnlocked(true);
    } catch {
      setUnlockError(true);
    } finally {
      setUnlockLoading(false);
    }
  };

  const allDagAccounts = useSelector(walletsSelectors.selectAllDagAccounts);

  const handleApprove = async () => {
    if (!callbackUrl || !requestId) return;
    setLoading(true);
    try {
      const addresses = allDagAccounts.map((account) => account.address);
      await redirectToCallback(callbackUrl, requestId, 'success', addresses);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('[Connect] Error approving:', error);
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!callbackUrl || !requestId) return;
    setLoading(true);
    try {
      await redirectToCallback(callbackUrl, requestId, 'rejected');
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('[Connect] Error rejecting:', error);
      setLoading(false);
    }
  };

  if (!callbackUrl || !requestId || !origin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <TextV3.Body color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
            No connection request found.
          </TextV3.Body>
        </View>
      </SafeAreaView>
    );
  }

  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAwareScrollView contentContainerStyle={styles.unlockContainer} extraScrollHeight={60}>
          <View style={styles.originContainer}>
            <TextV3.Caption color={COLORS_ENUMS.GRAY_100} align={TEXT_ALIGN_ENUM.CENTER}>
              Connection request from:
            </TextV3.Caption>
            <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
              {origin}
            </TextV3.BodyStrong>
          </View>

          <TextV3.HeaderLargeRegular color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
            Unlock Wallet
          </TextV3.HeaderLargeRegular>
          <TextV3.Body color={COLORS_ENUMS.GRAY_100} align={TEXT_ALIGN_ENUM.CENTER} extraStyles={styles.unlockDescription}>
            Enter your password to continue
          </TextV3.Body>

          <View style={styles.passwordInputContainer}>
            <TextInput name="password" type="password" placeholder="Enter your password" control={control} visiblePassword />
            {(errors.password || unlockError) && (
              <TextV3.CaptionStrong color={COLORS_ENUMS.RED} extraStyles={styles.errorText}>
                {errors.password?.message || 'Invalid password'}
              </TextV3.CaptionStrong>
            )}
          </View>

          <View style={styles.unlockButtonContainer}>
            <ButtonV3
              type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
              size={BUTTON_SIZES_ENUM.LARGE}
              title="Unlock"
              onPress={handleSubmit(handleUnlock)}
              disabled={unlockLoading}
              loading={unlockLoading}
            />
            <ButtonV3
              type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
              size={BUTTON_SIZES_ENUM.LARGE}
              title="Cancel"
              onPress={handleReject}
              disabled={unlockLoading}
              loading={false}
              extraContainerStyles={styles.cancelButton}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.originContainer}>
          <TextV3.Caption color={COLORS_ENUMS.GRAY_100} align={TEXT_ALIGN_ENUM.CENTER}>
            Connection request from:
          </TextV3.Caption>
          <TextV3.BodyStrong color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
            {origin}
          </TextV3.BodyStrong>
        </View>

        <View style={styles.titleContainer}>
          <TextV3.HeaderLargeRegular color={COLORS_ENUMS.BLACK} align={TEXT_ALIGN_ENUM.CENTER}>
            Connect Wallet
          </TextV3.HeaderLargeRegular>
        </View>

        <TextV3.Body color={COLORS_ENUMS.GRAY_100} align={TEXT_ALIGN_ENUM.CENTER} extraStyles={styles.description}>
          This site is requesting access to view your wallet addresses.
        </TextV3.Body>

        <ScrollView style={styles.accountsList}>
          {allDagAccounts.map((account, index) => (
            <View key={account.address} style={styles.accountItem}>
              <View style={styles.accountIcon}>
                <TextV3.Caption color={COLORS_ENUMS.BLACK}>{index + 1}</TextV3.Caption>
              </View>
              <View style={styles.accountInfo}>
                <TextV3.BodyStrong color={COLORS_ENUMS.BLACK}>
                  {(account as any).label || `Account ${index + 1}`}
                </TextV3.BodyStrong>
                <TextV3.Caption color={COLORS_ENUMS.GRAY_100}>{truncateAddress(account.address)}</TextV3.Caption>
              </View>
            </View>
          ))}

          {allDagAccounts.length === 0 && (
            <View style={styles.errorContainer}>
              <TextV3.Body color={COLORS_ENUMS.GRAY_100}>No DAG accounts found in your wallet.</TextV3.Body>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButtons}>
          <ButtonV3
            type={BUTTON_TYPES_ENUM.SECONDARY_OUTLINE}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Reject"
            onPress={handleReject}
            disabled={loading}
            loading={false}
            extraContainerStyles={styles.footerButtonLeft}
          />
          <ButtonV3
            type={BUTTON_TYPES_ENUM.PRIMARY_SOLID}
            size={BUTTON_SIZES_ENUM.LARGE}
            title="Connect"
            onPress={handleApprove}
            disabled={allDagAccounts.length === 0 || loading}
            loading={false}
            extraContainerStyles={styles.footerButtonRight}
          />
        </View>
        <TextV3.Caption color={COLORS_ENUMS.GRAY_100} align={TEXT_ALIGN_ENUM.CENTER} extraStyles={styles.safetyFooter}>
          Only connect to sites you trust.
        </TextV3.Caption>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  originContainer: {
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  titleContainer: {
    marginBottom: 12,
  },
  description: {
    marginBottom: 24,
  },
  accountsList: {
    flex: 1,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
  },
  accountIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BDBDBD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#BDBDBD',
  },
  footerButtons: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  footerButtonLeft: {
    flex: 1,
    marginRight: 8,
  },
  footerButtonRight: {
    flex: 1,
    marginLeft: 8,
  },
  safetyFooter: {
    opacity: 0.7,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unlockContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  unlockDescription: {
    marginTop: 8,
    marginBottom: 24,
  },
  passwordInputContainer: {
    marginBottom: 24,
  },
  errorText: {
    marginTop: 8,
  },
  unlockButtonContainer: {
    gap: 12,
  },
  cancelButton: {
    marginTop: 0,
  },
});

export default Connect;
