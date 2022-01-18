import { StyleSheet } from 'react-native';
import { COLORS } from 'assets/styles/_variables';

const styles = StyleSheet.create({
    icon: {
        width: 36,
        height: 36,
        background: COLORS.grayLight,
        color: COLORS.primary,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        svg: {
            fontSize: 22,
        }
    },
    iconSpaced: {
        marginRight: 12,
    }
});

export default styles;