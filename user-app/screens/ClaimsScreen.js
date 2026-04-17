import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ClaimsScreen({ route }) {
  const { worker } = route.params || {};
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await fetch('http://localhost:5000/claims');
        const allClaims = await res.json();
        // Filter claims for this specific user
        const myClaims = allClaims.filter(c => c.userId?._id === worker?._id || c.userId === worker?._id);
        setClaims(myClaims);
      } catch (err) {
        console.warn('Failed to load claims');
      } finally {
        setLoading(false);
      }
    }
    
    // Poll for new claims every 5 seconds since it's an AI automated system
    fetchClaims();
    const interval = setInterval(fetchClaims, 5000);
    return () => clearInterval(interval);
  }, [worker]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>My Claims</Text>
        
        {loading && <Text style={{ color: '#9ca3af' }}>Loading claims...</Text>}
        
        {!loading && claims.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛡️</Text>
            <Text style={styles.emptyText}>No claims submitted yet.</Text>
            <Text style={styles.emptySubtext}>Your automated payout history will appear here when triggers are hit.</Text>
          </View>
        ) : (
          <View style={styles.claimsList}>
            {claims.map((claim, index) => (
              <View key={claim._id || index} style={styles.claimCard}>
                <View style={styles.claimRow}>
                  <Text style={styles.claimType}>{claim.triggerType}</Text>
                  <Text style={styles.claimAmount}>+ Rs.{claim.payoutAmount}</Text>
                </View>
                <View style={styles.claimRow}>
                  <Text style={styles.claimDate}>
                    {new Date(claim.createdAt).toLocaleDateString()}
                  </Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>
                      {claim.status === 'paid' ? '✔ VERIFIED' : claim.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
                {claim.razorpayPayoutId && (
                  <View style={styles.txnRow}>
                    <Text style={styles.txnId}>Txn: {claim.razorpayPayoutId}</Text>
                    <Text style={styles.verifiedText}>Secure Payout</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
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
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
    backgroundColor: '#111318',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  claimsList: {
    marginTop: 8,
  },
  claimCard: {
    backgroundColor: '#111318',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 16,
  },
  claimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  claimType: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  claimAmount: {
    color: '#34d399',
    fontSize: 16,
    fontWeight: '700',
  },
  claimDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  statusBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  statusText: {
    color: '#34d399',
    fontSize: 10,
    fontWeight: '800',
  },
  txnRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txnId: {
    color: '#9ca3af',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  verifiedText: {
    color: '#6b7280',
    fontSize: 10,
    fontStyle: 'italic',
  }
});
