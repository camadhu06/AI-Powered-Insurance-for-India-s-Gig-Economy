import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';

export default function SupportScreen({ route }) {
  const { worker } = route.params || {};
  const [eventType, setEventType] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!eventType || !pinCode) return;
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:5000/claims/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: worker?._id, 
          triggerType: 'Strike', // mapping all manual reports to a generic strike/system disruption for demo
          severity: 100,
          hoursLost: 3
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        Alert.alert("Report Submitted", "Our AI has verified your report and initiated a claim.");
        setEventType('');
        setPinCode('');
      } else {
        Alert.alert("Error", data.message || data.error || "Failed to submit.");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Support & SOS</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>EMERGENCY HELPLINE</Text>
          <Text style={styles.descText}>Call our 24/7 gig worker support line for immediate assistance with active policies.</Text>
          <Pressable style={styles.callBtn}>
             <Text style={styles.callBtnText}>📞 1800-GIG-SAFE</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>REPORT DISRUPTION</Text>
        <View style={styles.card}>
          <Text style={styles.descText}>Has an unforecasted event (like a localized strike, riot, or flash flood) halted your work? Our AI validates reports in real-time.</Text>
          
          <Text style={styles.label}>Event Type</Text>
          <TextInput 
            style={styles.inputBox}
            placeholder="e.g. Political Strike, Roadblock..."
            placeholderTextColor="#6b7280"
            value={eventType}
            onChangeText={setEventType}
          />

          <Text style={styles.label}>Location / PIN Code</Text>
          <TextInput 
            style={styles.inputBox}
            placeholder="e.g. 560001"
            placeholderTextColor="#6b7280"
            keyboardType="number-pad"
            value={pinCode}
            onChangeText={setPinCode}
          />

          <Pressable 
            style={[styles.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Submit for AI Verification</Text>}
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#08090b' },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 24, letterSpacing: -0.5 },
  sectionTitle: { color: '#9ca3af', fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 12, marginTop: 8 },
  card: { backgroundColor: '#111318', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#1f2937', marginBottom: 24 },
  cardTitle: { color: '#f37500', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  descText: { color: '#9ca3af', fontSize: 13, lineHeight: 20, marginBottom: 20 },
  callBtn: { backgroundColor: 'rgba(59, 130, 246, 0.1)', borderWidth: 1, borderColor: '#3b82f6', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  callBtnText: { color: '#3b82f6', fontSize: 16, fontWeight: '700' },
  label: { color: '#6b7280', fontSize: 11, fontWeight: '600', marginBottom: 8, marginTop: 8, letterSpacing: 0.5 },
  inputBox: { backgroundColor: '#08090b', borderWidth: 1, borderColor: '#1f2937', borderRadius: 10, padding: 14, marginBottom: 12, color: '#fff', fontSize: 14 },
  submitBtn: { backgroundColor: '#f37500', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' }
});
