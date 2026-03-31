import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';

export default function SuccessScreen({ route, navigation }) {
  const worker = route.params?.worker;
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
            <Text style={styles.detailValue}>{worker?.platform || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>City</Text>
            <Text style={styles.detailValue}>{worker?.city || '—'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Avg Weekly Earning</Text>
            <Text style={styles.detailValue}>
              ₹{worker?.avgWeeklyEarning?.toLocaleString('en-IN') || '—'}
            </Text>
          </View>
        </View>

        {/* ── Next Steps ── */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextTitle}>WHAT'S NEXT</Text>

          <Pressable
            style={[styles.stepRow, hoveredStep === 0 && styles.stepRowHovered]}
            onHoverIn={() => setHoveredStep(0)}
            onHoverOut={() => setHoveredStep(null)}
            onPress={() => navigation.navigate('PlanSelect', { worker })}
          >
            <View style={[styles.stepDot, hoveredStep === 0 && styles.stepDotHovered]} />
            <Text style={[styles.stepText, hoveredStep === 0 && styles.stepTextHovered]}>
              Choose an insurance plan
            </Text>
          </Pressable>

          <Pressable
            style={[styles.stepRow, hoveredStep === 1 && styles.stepRowHovered]}
            onHoverIn={() => setHoveredStep(1)}
            onHoverOut={() => setHoveredStep(null)}
            onPress={() => console.log('UPI setup')}
          >
            <View style={[styles.stepDot, hoveredStep === 1 && styles.stepDotHovered]} />
            <Text style={[styles.stepText, hoveredStep === 1 && styles.stepTextHovered]}>
              Set up UPI auto-debit
            </Text>
          </Pressable>

          <Pressable
            style={[styles.stepRow, hoveredStep === 2 && styles.stepRowHovered]}
            onHoverIn={() => setHoveredStep(2)}
            onHoverOut={() => setHoveredStep(null)}
            onPress={() => console.log('Dashboard')}
          >
            <View style={[styles.stepDot, hoveredStep === 2 && styles.stepDotHovered]} />
            <Text style={[styles.stepText, hoveredStep === 2 && styles.stepTextHovered]}>
              Start delivering with protection
            </Text>
          </Pressable>
        </View>
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

  // Next steps
  nextSteps: {
    width: '100%',
    gap: 12,
  },
  nextTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    cursor: 'pointer',
    transitionProperty: 'transform',
    transitionDuration: '0.2s',
  },
  stepRowHovered: {
    transform: [{ translateX: -4 }],
    borderBottomColor: '#FF5722',
  },
  stepDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#f37500',
    transitionProperty: 'transform',
    transitionDuration: '0.2s',
  },
  stepDotHovered: {
    transform: [{ scale: 0.7 }],
  },
  stepText: {
    fontSize: 16,
    color: '#9ca3af',
    transitionProperty: 'color',
    transitionDuration: '0.2s',
  },
  stepTextHovered: {
    color: '#ffffff',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 36,
    fontSize: 11,
    color: '#2d3748',
  },
});
