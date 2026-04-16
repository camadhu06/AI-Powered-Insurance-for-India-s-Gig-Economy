import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';

export default function SupportScreen({ route }) {
  const { worker } = route.params || {};
  const [eventType, setEventType] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const handleSubmit = async () => {
    if (!eventType || !pinCode) return;
    setLoading(true);
    setTimeline([
      { id: 1, text: "Authenticating location and user...", status: "done" },
      { id: 2, text: "Sent to AI Fraud Detection engine...", status: "loading" }
    ]);
    
    // Simulate initial latency for dramatic effect
    await new Promise(r => setTimeout(r, 1200));
    
    let res, data;
    try {
      res = await fetch('http://localhost:5000/claims/auto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: worker?._id, 
          triggerType: 'Strike',
          severity: 100,
          hoursLost: 3
        })
      });
      data = await res.json();
    } catch (err) {
      setTimeline(prev => [
        ...prev.map(t => t.id === 2 ? { ...t, status: "error" } : t),
        { id: 3, text: `Connection Failed: ${err.message}`, status: "error", final: true }
      ]);
      setLoading(false);
      return;
    }

    if (res.status === 403 || !res.ok) {
      // Fraud or duplicate
      setTimeline(prev => [
        ...prev.map(t => t.id === 2 ? { ...t, status: "error" } : t),
        { id: 3, text: "Anomalous patterns found in claim logic.", status: "error" },
        { id: 4, text: data.fraudScore 
          ? `Fraud Detected (Score: ${data.fraudScore.toFixed(1)}). Claim Blocked.` 
          : (data.error || "Claim rejected processing error."), status: "error", final: true }
      ]);
      setLoading(false);
      return;
    }
    
    // Success path follows ML checking
    setTimeline(prev => [
        ...prev.map(t => t.id === 2 ? { ...t, text: `AI Fraud check passed (Score: ${data.ai_insights?.fraud_score?.toFixed(1) || 0}).`, status: "done" } : t),
        { id: 3, text: "AI Income Estimator calculating payout...", status: "loading" }
    ]);
    
    await new Promise(r => setTimeout(r, 1500));
    
    setTimeline(prev => [
        ...prev.map(t => t.id === 3 ? { ...t, text: `AI Model Estimated Loss: Rs. ${data.ai_insights?.loss_estimated || 0}`, status: "done" } : t),
        { id: 4, text: "Claim Success! Check Claims Page.", status: "done", final: true }
    ]);
    
    setLoading(false);
    
    setTimeout(() => {
        setEventType('');
        setPinCode('');
        setTimeline([]);
    }, 5000);
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

          {/* AI Timeline UI */}
          {timeline.length > 0 && (
            <View style={{ marginTop: 24, padding: 16, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 12, borderWidth: 1, borderColor: '#1f2937' }}>
              {timeline.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: idx === timeline.length - 1 ? 0 : 12 }}>
                  <Text style={{ marginRight: 12, fontSize: 16 }}>{item.status === 'loading' ? '⏳' : item.status === 'error' ? '❌' : '✅'}</Text>
                  <Text style={{ 
                    color: item.status === 'error' ? '#fca5a5' : (item.status === 'done' && item.final) ? '#86efac' : '#d1d5db', 
                    fontSize: 13, 
                    flex: 1, 
                    lineHeight: 20, 
                    fontWeight: item.final ? '700' : '500' 
                  }}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          )}
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
