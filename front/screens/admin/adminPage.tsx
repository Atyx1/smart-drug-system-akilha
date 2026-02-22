import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTheme } from '../../context/ThemeContext';

const adminPage: React.FC = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {t('admin_dashboard')}
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {t('welcome_admin_message') || 'Welcome to the Admin Dashboard'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
  },
  title: {
    fontSize: wp('7%'),
    fontWeight: 'bold',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp('4%'),
    textAlign: 'center',
    marginBottom: hp('4%'),
  },
});

export default adminPage;
