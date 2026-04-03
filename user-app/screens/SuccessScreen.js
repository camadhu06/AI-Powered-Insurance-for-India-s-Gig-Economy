import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';

export default function SuccessScreen({ route, navigation }) {
  const { worker } = route.params || {};
  const [hoveredStep, setHoveredStep] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* ── Checkmark Circle ── */}
      <Animated.View
        style={[
          styles.checkCircle,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.checkMark}>✓</Text>
      </Animated.View>

      {/* ── Content ── */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Registration Successful!</Text>
        <Text style={styles.subtitle}>
          Welcome to GigWare, {worker?.name || 'Worker'}
        </Text>

        {/* ── Details Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>YOUR DETAILS</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{worker?.name || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{worker?.phone || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Platform</Text>
            <Text style={styles.detailValue}>{worker?.platforms?.[0] || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>{worker?.city || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Avg Daily Earning</Text>
            <Text style={styles.detailValue}>
              ₹{worker.avgDailyEarnings}
            </Text>
          </View>
        </View>

        {/* ── Next Action ── */}
        <Pressable
          style={({ pressed }) => [
            styles.planBtn,
            pressed && styles.planBtnPressed
          ]}
          onPress={() => navigation.navigate('PlanSelect', { worker })}
        >
          <Text style={styles.planBtnText}>Get My Weekly Plan</Text>
        </Pressable>
      </Animated.View>

      {/* ── Footer ── */}
      <Animated.Text style={[styles.footer, { opacity: fadeAnim }]}>
        GigWare · Protecting gig workers, automatically
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08090b',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },

  // Checkmark
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(243, 117, 0, 0.1)',
    borderWidth: 2,
    borderColor: '#f37500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  checkMark: {
    fontSize: 32,
    color: '#f37500',
    fontWeight: '700',
  },

  // Content
  content: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 28,
  },

  // Card
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#111318',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f37500',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#1f2937',
    marginVertical: 6,
  },

  // Plan Button
  planBtn: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#f37500',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planBtnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  planBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 36,
    fontSize: 11,
    color: '#2d3748',
  },
});
