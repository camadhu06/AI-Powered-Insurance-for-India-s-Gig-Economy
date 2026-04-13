import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';

export default function HomeScreen({ route, navigation }) {
  const { worker } = route.params || {};
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{worker?.name || 'Worker'}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(worker?.name || 'W').charAt(0)}</Text>
            </View>
          </View>

          {/* Active Policy Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>ACTIVE POLICY</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>PROTECTED</Text>
              </View>
            </View>
            <Text style={styles.planName}>{worker?.planName || 'Standard Shield'}</Text>
            <Text style={styles.planDetails}>Active Weekly Coverage</Text>
            <View style={styles.divider} />
            
            <View style={{marginBottom: 16}}>
               <Text style={styles.label}>Earnings Protected</Text>
               <Text style={[styles.value, {fontSize: 28, color: '#22c55e'}]}>₹{worker?.cap || '2,500'}.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Covered Disruptions</Text>
                <Text style={styles.value}>Rain, Heat, AQI, Flood</Text>
              </View>
              <View>
                <Text style={styles.label}>Auto-renewal</Text>
                <Text style={styles.value}>Active</Text>
              </View>
            </View>
          </View>

          {/* Zone Alerts */}
          <Text style={styles.sectionTitle}>ZONE ALERTS</Text>
          <View style={[styles.card, { borderColor: 'rgba(239, 68, 68, 0.3)' }]}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIcon}><Text style={styles.alertIconText}>!</Text></View>
              <Text style={styles.alertTitle}>Heavy Rain Expected</Text>
            </View>
            <Text style={styles.alertDesc}>
              IMD forecasts heavy rainfall in your zone tomorrow between 2 PM - 6 PM. Drive safely.
            </Text>
            <Pressable style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Read Safety Guide</Text>
            </Pressable>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08090b',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    color: '#6b7280',
    fontSize: 14,
  },
  name: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(243, 117, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#f37500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#f37500',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#111318',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#f37500',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  statusBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  statusText: {
    color: '#22c55e',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  planDetails: {
    color: '#6b7280',
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#6b7280',
    fontSize: 11,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  alertIconText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  alertTitle: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  alertDesc: {
    color: '#9ca3af',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionBtn: {
    backgroundColor: 'rgba(243, 117, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#f37500',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#f37500',
    fontWeight: '600',
    fontSize: 13,
  },
});
