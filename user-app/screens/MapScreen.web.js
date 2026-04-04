import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Map</Text>
        <Text style={styles.subtitle}>Real-time route risk detection</Text>
      </View>

      <View style={styles.mapContainer}>
        <View style={styles.webPlaceholder}>
          <Text style={styles.icon}>🗺️</Text>
          <Text style={styles.infoText}>Interactive Map available on the Native mobile app.</Text>
          <Text style={styles.alertText}>⚠️ AHEAD: Waterlogging Detected</Text>
        </View>
      </View>

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>CURRENT ROUTE STATUS</Text>
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View>
            <Text style={styles.alertTextItem}>Waterlogging Ahead</Text>
            <Text style={styles.alertSub}>Your policy covers delays caused by this.</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08090b' },
  header: { padding: 24, paddingTop: 60, paddingBottom: 16 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { color: '#9ca3af', fontSize: 13, marginTop: 4 },
  mapContainer: { flex: 1, borderRadius: 20, overflow: 'hidden', marginHorizontal: 16, marginBottom: 16 },
  webPlaceholder: { flex: 1, backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center', padding: 20 },
  icon: { fontSize: 40, marginBottom: 10 },
  infoText: { color: '#9ca3af', fontSize: 16, textAlign: 'center' },
  alertText: { color: '#ef4444', fontSize: 14, marginTop: 10, fontWeight: 'bold' },
  legendCard: { backgroundColor: '#111318', padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#1f2937' },
  legendTitle: { color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  alertBox: { flexDirection: 'row', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: '#f59e0b', padding: 16, borderRadius: 12, alignItems: 'center' },
  alertIcon: { fontSize: 24, marginRight: 12 },
  alertTextItem: { color: '#f59e0b', fontSize: 16, fontWeight: '700' },
  alertSub: { color: '#9ca3af', fontSize: 12, marginTop: 2 }
});
