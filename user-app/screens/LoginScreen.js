import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin() {
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/worker-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.replace('MainTabs', { worker: data.worker });
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        {/* Brand */}
        <View style={styles.brandRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoLetter}>G</Text>
          </View>
          <Text style={styles.logoText}>GigWare</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Log in with your registered mobile number
        </Text>

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>MOBILE NUMBER</Text>
          <TextInput
            style={styles.input}
            placeholder="10-digit mobile number"
            placeholderTextColor="#4b5563"
            value={phone}
            onChangeText={(v) => { setPhone(v); if (error) setError(null); }}
            keyboardType="phone-pad"
            maxLength={10}
            editable={!loading}
          />
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Switch to Register */}
        <TouchableOpacity
          onPress={() => navigation.replace('Register')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchText}>
            Don't have an account? <Text style={styles.switchLink}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08090b',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  logoIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#f37500',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    fontWeight: '800',
    fontSize: 18,
    color: '#fff',
  },
  logoText: {
    fontWeight: '700',
    fontSize: 22,
    color: '#fff',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 32,
  },
  inputGroup: {
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    padding: 14,
    marginTop: 12,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: '#f37500',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 24,
  },
  switchLink: {
    color: '#f37500',
    fontWeight: '600',
  },
});
