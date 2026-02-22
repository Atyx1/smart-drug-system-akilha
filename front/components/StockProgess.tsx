import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/context/ThemeContext';

interface StockProgressProps {
  name: string;
  stock: number;
}

const StockProgress: React.FC<StockProgressProps> = ({ name, stock }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getColor = (stock: number) => {
    if (stock > 7) return '#007bff'; // Mavi (Güvenli Stok)
    if (stock > 3) return '#999';     // Gri (Düşük Stok)
    return '#ff4d4d';                // Kırmızı (Kritik Stok)
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.medicineName, { color: isDark ? '#fff' : '#000' }]}>
        {name}
      </Text>

      <Progress.Circle
        size={60}
        progress={stock / 14}
        color={getColor(stock)}
        thickness={5}
        showsText
        formatText={() => `${stock}/14`}
        textStyle={{
          fontSize: 12,
          color: isDark ? '#fff' : '#000'
        }}
        unfilledColor={isDark ? '#444' : '#eee'}
        borderWidth={0}
      />
    </View>
  );
};

export default StockProgress;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  medicineName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
  },
});
