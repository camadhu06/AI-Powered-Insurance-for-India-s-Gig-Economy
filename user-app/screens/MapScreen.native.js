import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function MapScreen() {
  const initialRegion = {
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  const routeCoordinates = [
    { latitude: 12.9716, longitude: 77.5946 }, // Start
    { latitude: 12.9750, longitude: 77.6000 },
    { latitude: 12.9800, longitude: 77.6050 }, // Disruption
    { latitude: 12.9850, longitude: 77.6100 },
    { latitude: 12.9900, longitude: 77.6150 }, // End
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Map</Text>
        <Text style={styles.subtitle}>Real-time route risk detection</Text>
      </View>

      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <View style={[styles.map, { backgroundColor: '#1f2937', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 40, marginBottom: 10 }}>🗺️</Text>
            <Text style={{ color: '#9ca3af', fontSize: 16 }}>Interactive Map available on native mobile app.</Text>
            <Text style={{ color: '#ef4444', fontSize: 14, marginTop: 10 }}>⚠️ AHEAD: Waterlogging Detected</Text>
          </View>
        ) : (
          <MapView 
            style={styles.map} 
            initialRegion={initialRegion}
            userInterfaceStyle="dark"
          >
            <Polyline 
              coordinates={routeCoordinates}
              strokeColor="#3b82f6"
              strokeWidth={4}
            />
            <Marker 
              coordinate={routeCoordinates[0]} 
              title="Pickup"
              pinColor="#22c55e"
            />
            <Marker 
              coordinate={routeCoordinates[4]} 
              title="Dropoff"
              pinColor="#3b82f6"
            />
            <Marker 
              coordinate={routeCoordinates[2]} 
              title="AHEAD: Waterlogging"
              description="High risk zone detected by API."
            >
              <View style={styles.disruptionMarker}>
                <Text style={{fontSize: 20}}>⚠️</Text>
              </View>
            </Marker>
          </MapView>
        )}
      </View>

      <View style={styles.legendCard}>
        <Text style={styles.legendTitle}>CURRENT ROUTE STATUS</Text>
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>⚠️</Text>
          <View>
            <Text style={styles.alertText}>Waterlogging Ahead</Text>
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
  map: { width: '100%', height: '100%' },
  disruptionMarker: { backgroundColor: 'rgba(2ef, 68, 68, 0.2)', borderRadius: 20, padding: 4 },
  legendCard: { backgroundColor: '#111318', padding: 24, paddingBottom: 40, borderTopWidth: 1, borderTopColor: '#1f2937' },
  legendTitle: { color: '#6b7280', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  alertBox: { flexDirection: 'row', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: '#f59e0b', padding: 16, borderRadius: 12, alignItems: 'center' },
  alertIcon: { fontSize: 24, marginRight: 12 },
  alertText: { color: '#f59e0b', fontSize: 16, fontWeight: '700' },
  alertSub: { color: '#9ca3af', fontSize: 12, marginTop: 2 }
});
