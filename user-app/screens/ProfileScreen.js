import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';

export default function ProfileScreen({ route, navigation }) {
  const { worker } = route.params || {};

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(worker?.name || 'W').charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.name}>{worker?.name || 'Worker'} </Text>
              <Text style={styles.phone}>{worker?.phone || '+91 9876543210'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>{worker?.city || 'Bengaluru'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.label}>Zone Risk Level</Text>
            <Text style={[styles.value, { color: '#f59e0b' }]}>Medium</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>LINKED PLATFORMS</Text>
        <View style={styles.card}>
          <View style={styles.platformRow}>
            <View style={[styles.platformDot, { backgroundColor: '#fc8019' }]} />
            <Text style={styles.platformName}>Swiggy</Text>
            <Text style={styles.platformStatus}>Connected</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.platformRow}>
            <View style={[styles.platformDot, { backgroundColor: '#e23744' }]} />
            <Text style={styles.platformName}>Zomato</Text>
            <Text style={styles.platformStatus}>Connected</Text>
          </View>
        </View>

        <Pressable 
          style={styles.logoutBtn}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08090b' },
  scrollContent: { padding: 24, paddingTop: 60 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 24, letterSpacing: -0.5 },
  sectionTitle: { color: '#9ca3af', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#111318', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#1f2937', marginBottom: 24 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(243, 117, 0, 0.1)', borderWidth: 1, borderColor: '#f37500', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#f37500', fontSize: 24, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 20, fontWeight: '700' },
  phone: { color: '#6b7280', fontSize: 14, marginTop: 4 },
  divider: { height: 1, backgroundColor: '#1f2937', marginVertical: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: '#6b7280', fontSize: 14 },
  value: { color: '#fff', fontSize: 14, fontWeight: '600' },
  platformRow: { flexDirection: 'row', alignItems: 'center' },
  platformDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  platformName: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1 },
  platformStatus: { color: '#22c55e', fontSize: 12, fontWeight: '600' },
  logoutBtn: { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderWidth: 1, borderColor: '#ef4444', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  logoutBtnText: { color: '#ef4444', fontSize: 16, fontWeight: '700' }
});
