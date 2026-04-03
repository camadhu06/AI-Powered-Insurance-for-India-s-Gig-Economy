import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic Shield',
    price: 49,
    cap: 1500,
    features: ['Rain + Extreme Heat triggers'],
    pill: null,
  },
  {
    id: 'standard',
    name: 'Standard Shield',
    price: 79,
    cap: 2500,
    features: ['Rain + Heat + AQI', 'Flood + Strike'],
    pill: 'BEST',
  },
  {
    id: 'full',
    name: 'Full Shield',
    price: 99,
    cap: 7500,
    features: ['Rain + Heat + AQI', 'Flood + Strike + War', 'Instant payout'],
    pill: null,
  },
];

export default function PlanSelect({ route, navigation }) {
  const { worker } = route.params || {};
  const workerId = worker?._id;

  const [selected, setSelected] = useState('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedPlan = PLANS.find((p) => p.id === selected);

  async function handleActivate() {
    if (!selectedPlan || !workerId) return;

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/select-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: workerId,
          planName: selectedPlan.name,
          weeklyPremium: selectedPlan.price,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Just go back to the Success screen which should reflect the updated plan in the DB
        navigation.navigate('Success', { worker: data.user });
      } else {
        setError(data.message || 'Failed to activate plan.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>GigWare</Text>
          <Text style={styles.heading}>Pick your shield.</Text>
          <Text style={styles.subtext}>Weekly coverage. Cancel anytime.</Text>
        </View>

        {/* Plans */}
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            return (
              <Pressable
                key={plan.id}
                style={[styles.planCard, isSelected && styles.planCardSelected]}
                onPress={() => setSelected(plan.id)}
              >
                <View style={styles.planHeaderRow}>
                  <Text style={[styles.planName, isSelected && styles.planNameSelected]}>
                    {plan.name}
                  </Text>
                  {plan.pill && (
                    <View style={styles.pill}>
                      <Text style={styles.pillText}>{plan.pill}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceRs}>Rs.{plan.price}</Text>
                  <Text style={styles.pricePeriod}>/week</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.capText}>Weekly Cap: Rs.{plan.cap}</Text>
                
                <View style={styles.featuresList}>
                  {plan.features.map((f, i) => (
                    <Text key={i} style={styles.featureItem}>• {f}</Text>
                  ))}
                </View>
              </Pressable>
            );
          })}
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      {/* Bottom Sticky Action */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarInfo}>
          <Text style={styles.bottomBarName}>{selectedPlan?.name}</Text>
          <Text style={styles.bottomBarPrice}>Rs.{selectedPlan?.price}/week</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.activateBtn,
            loading && styles.activateBtnDisabled,
            pressed && styles.activateBtnPressed
          ]}
          onPress={handleActivate}
          disabled={loading}
        >
          <Text style={styles.activateBtnText}>
            {loading ? 'Processing...' : `Activate ${selectedPlan?.name}`}
          </Text>
        </Pressable>
      </View>
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
    paddingBottom: 140, // Space for bottom bar
  },
  header: {
    marginTop: 40,
    marginBottom: 32,
  },
  wordmark: {
    color: '#f37500',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  heading: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtext: {
    color: '#9ca3af',
    fontSize: 16,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#111318',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  planCardSelected: {
    borderColor: '#f37500',
    backgroundColor: '#1a1410', // slight orange tint
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  planNameSelected: {
    color: '#f37500',
  },
  pill: {
    backgroundColor: '#f37500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  priceRs: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  pricePeriod: {
    color: '#6b7280',
    fontSize: 16,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginBottom: 16,
  },
  capText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    color: '#9ca3af',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 20,
    textAlign: 'center',
  },
  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#111318',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    padding: 24,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomBarInfo: {
    flex: 1,
  },
  bottomBarName: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 4,
  },
  bottomBarPrice: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  activateBtn: {
    backgroundColor: '#f37500',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activateBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  activateBtnDisabled: {
    opacity: 0.5,
  },
  activateBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
