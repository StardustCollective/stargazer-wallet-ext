// ///////////////////////
// // Modules
// ///////////////////////

// import React, { FC } from 'react';
// import { View, Text, TouchableHighlight, Image as ReactNativeImage } from 'react-native';
// import { Image } from 'react-native-elements';

// ///////////////////////
// // Components
// ///////////////////////

// import Card from 'components/Card';
// import TextV3 from 'components/TextV3';

// ///////////////////////
// // Images
// ///////////////////////

// import WalletIcon from 'assets/images/svg/wallet.svg';
// import ContactsIcon from 'assets/images/svg/contacts.svg';
// import NetworksIcon from 'assets/images/svg/networks.svg';
// import InfoIcon from 'assets/images/svg/info.svg';
// import ExitIcon from 'assets/images/svg/exit.svg';
// import LinkedApps from 'assets/images/svg/linkedApps.svg';

// ///////////////////////
// // Hooks
// ///////////////////////
// // import { useController } from 'hooks/index';
// // import useVersion from 'hooks/useVersion';
// import { useLinkTo } from '@react-navigation/native';

// ///////////////////////
// // Styles
// ///////////////////////

// // import styles from './index.scss';
// import styles from './styles';

// ///////////////////////
// // Enums
// ///////////////////////

// import { COLORS } from 'assets/styles/_variables';

// ///////////////////////
// // Types
// ///////////////////////

// type IRenderSettingsItemProps = {
//   label: string;
//   IconComponent: any;
//   onClick: () => void;
//   imageStyles?: object;
// };

// ///////////////////////
// // Constants
// ///////////////////////

// ///////////////////////
// // Scene
// ///////////////////////

// const Main: FC = () => {
//   // const controller = useController();
//   // const version = useVersion(3);
//   const linkTo = useLinkTo();

//   const handleLogout = () => {
//     // controller.wallet.logOut();
//     // linkTo('/authRoot');
//   };

//   const onWalletLinkClick = () => {
//     // linkTo('/settings/wallets');
//   };

//   const onNetworkLinkClicked = () => {
//     // linkTo('/settings/networks');
//   };

//   const onAboutLinkClicked = () => {
//     // linkTo('/settings/about');
//   };

//   const onContactsLinkClicked = () => {
//     // linkTo('/settings/contacts');
//   };

//   const onConnectedSitesClicked = () => {
//     // linkTo('/settings/connectedSites');
//   };

//   const RenderSettingsItem = ({
//     label,
//     IconComponent,
//     imageStyles = {},
//     onClick,
//   }: IRenderSettingsItemProps) => {
//     return (
//       <Card
//         id={'settings-' + label.toLowerCase()}
//         onClick={onClick}
//         style={styles.card}
//       >
//         <View style={styles.settingsItemIconWrapper}>
//           <View style={styles.iconCircle}>
//             <IconComponent/>
//           </View>
//         </View>
//         <View style={styles.settingsItemLabelWrapper}>
//           <TextV3.BodyStrong color={COLORS.black}>{label}</TextV3.BodyStrong>
//         </View>
//       </Card>
//     );
//   };

//   return (
//     <View style={styles.main}>
//       <View style={styles.box}>
//         <View style={styles.content}>
//           <RenderSettingsItem
//             label={'Wallets'}
//             IconComponent={WalletIcon}
//             onClick={onWalletLinkClick}
//           />
//           <RenderSettingsItem
//             label={'Contacts'}
//             IconComponent={ContactsIcon}
//             onClick={onContactsLinkClicked}
//           />
//           <RenderSettingsItem
//             label={'Networks'}
//             IconComponent={NetworksIcon}
//             onClick={onNetworkLinkClicked}
//           />
//           <RenderSettingsItem
//             label={'Connected Sites'}
//             IconComponent={LinkedApps}
//             onClick={onConnectedSitesClicked}
//             imageStyles={styles.linkedIconImage}
//           />
//         </View>
//       </View>
//       <View style={styles.footer}>
//         <TouchableHighlight onPress={onAboutLinkClicked}>
//           <View style={styles.footer__left}>
//             <InfoIcon
//               style={styles.footer__left_img}/>
//             <TextV3.Caption>Stargazer Wallet {version}</TextV3.Caption>
//           </View>
//         </TouchableHighlight>
//         <TouchableHighlight onPress={handleLogout}>
//           <View style={styles.footer__right}>
//             <TextV3.Caption>Logout</TextV3.Caption>
//             <Text>Logout</Text>
//             <ExitIcon
//               style={styles.footer__right_img}
//             />
//           </View>
//         </TouchableHighlight>
//       </View>
//     </View>
//   );
// };

// export default Main;
