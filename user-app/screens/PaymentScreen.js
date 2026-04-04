import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

export default function PaymentScreen({ route, navigation }) {
  const { worker, plan } = route.params || {};

  const spinValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Auto-redirect to Dashboard after "processing"
    const timer = setTimeout(() => {
       navigation.replace('MainTabs', { worker });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secure Checkout</Text>
      <Text style={styles.subtitle}>Processing payment securely via Razorpay Mock.</Text>

      <View style={styles.card}>
        <View style={styles.row}>
           <Text style={styles.label}>Plan Total</Text>
           <Text style={styles.value}>Rs. {plan?.price || '0'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
           <Text style={styles.label}>Taxes & Fees</Text>
           <Text style={styles.value}>Rs. {Math.round((plan?.price || 0) * 0.18)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.row}>
           <Text style={styles.totalLabel}>Total Deducted</Text>
           <Text style={styles.totalValue}>Rs. {Math.round((plan?.price || 0) * 1.18)}</Text>
        </View>
      </View>

      <View style={styles.spinnerContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Text style={styles.spinner}>⚙️</Text>
        </Animated.View>
        <Text style={styles.processingText}>Confirming with Gateway...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08090b', padding: 24, paddingTop: 60, alignItems: 'center' },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#9ca3af', fontSize: 13, marginBottom: 40, textAlign: 'center' },
  card: { backgroundColor: '#111318', width: '100%', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#1f2937', marginBottom: 60 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' },
  divider: { height: 1, backgroundColor: '#1f2937', marginBottom: 16 },
  label: { color: '#6b7280', fontSize: 14 },
  value: { color: '#fff', fontSize: 16, fontWeight: '600' },
  totalLabel: { color: '#f37500', fontSize: 16, fontWeight: '700' },
  totalValue: { color: '#f37500', fontSize: 22, fontWeight: '800' },
  spinnerContainer: { alignItems: 'center' },
  spinner: { fontSize: 40, marginBottom: 16 },
  processingText: { color: '#9ca3af', fontSize: 14, fontWeight: '600' }
});
