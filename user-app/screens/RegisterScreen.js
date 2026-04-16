import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const PLATFORMS = ['Zomato', 'Swiggy'];


export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    platform: '',
    city: '',
    avgWeeklyEarning: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  }

  function validate() {
    if (!form.name.trim()) return 'Please enter your full name.';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.trim()))
      return 'Please enter a valid 10-digit mobile number.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email.trim()))
      return 'Please enter a valid email address.';
    if (!form.platform) return 'Please select your delivery partner.';
    if (!form.city.trim()) return 'Please enter your city.';
    if (!form.avgWeeklyEarning.trim() || isNaN(Number(form.avgWeeklyEarning)))
      return 'Please enter your average weekly earning.';
    return null;
  }

  async function handleRegister() {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    // Switch to OTP verification UI step instead of calling backend immediately
    setShowOtp(true);
  }

  async function verifyOtpAndSubmit() {
    if (otp !== '1234') { // Mock OTP for hackathon demo
      setError('Invalid OTP code. Please use 1234 for demo.');
      return;
    }

    setShowOtp(false);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          platform: form.platform,
          city: form.city.trim(),
          avgDailyEarnings: Math.round(Number(form.avgWeeklyEarning) / 7), // Convert weekly → daily
        }),
      });

      const data = await res.json();

      if (res.ok) {
        navigation.replace('Success', { worker: data.user });
      } else {
        setError(data.message || 'Registration failed.');
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Brand Header ── */}
        <View style={styles.brandRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoLetter}>G</Text>
          </View>
          <Text style={styles.logoText}>GigWare</Text>
        </View>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Join thousands of gig workers protected by parametric insurance
        </Text>

        {/* ── Form ── */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor="#4b5563"
              value={form.name}
              onChangeText={(v) => updateField('name', v)}
              editable={!loading}
            />
          </View>

          {/* Mobile Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>MOBILE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor="#4b5563"
              value={form.phone}
              onChangeText={(v) => updateField('phone', v)}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#4b5563"
              value={form.email}
              onChangeText={(v) => updateField('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Delivery Partner */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DELIVERY PARTNER</Text>
            <View style={styles.chipRow}>
              {PLATFORMS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.chip,
                    form.platform === p && styles.chipActive,
                  ]}
                  onPress={() => updateField('platform', p)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipText,
                      form.platform === p && styles.chipTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* City */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CITY</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your city"
              placeholderTextColor="#4b5563"
              value={form.city}
              onChangeText={(v) => updateField('city', v)}
              editable={!loading}
            />
          </View>

          {/* Avg Weekly Earning */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>AVG WEEKLY EARNING (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4500"
              placeholderTextColor="#4b5563"
              value={form.avgWeeklyEarning}
              onChangeText={(v) => updateField('avgWeeklyEarning', v)}
              keyboardType="numeric"
              editable={!loading}
            />
          </View>
        </View>

        {/* ── Error ── */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* ── Register Button ── */}
        {!showOtp ? (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Verify Email →</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.otpSection}>
            <Text style={styles.label}>ENTER VERIFICATION CODE</Text>
            <Text style={styles.otpHelper}>A code was sent to {form.email}</Text>
            <TextInput
              style={styles.input}
              placeholder="4-digit OTP (1234)"
              placeholderTextColor="#4b5563"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={verifyOtpAndSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Confirm & Start Trial</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ── Footer ── */}
        <Text style={styles.footer}>
          By registering you agree to GigWare's Terms & Conditions
        </Text>

        <TouchableOpacity
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.switchText}>
            Already registered? <Text style={styles.switchLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08090b',
  },
  scroll: {
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Brand
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
    fontSize: 24,
    color: '#fff',
    letterSpacing: -0.5,
  },

  // Heading
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

  // Form
  formSection: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
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

  // Chips
  chipRow: {
    flexDirection: 'row',
    gap: 10,
  },
  chip: {
    flex: 1,
    backgroundColor: '#111318',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: '#f37500',
    backgroundColor: 'rgba(243, 117, 0, 0.08)',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  chipTextActive: {
    color: '#f37500',
  },

  // Error
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },
  errorText: {
    color: '#fca5a5',
    fontSize: 13,
    lineHeight: 18,
  },

  // Button
  button: {
    backgroundColor: '#f37500',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Footer
  footer: {
    fontSize: 11,
    color: '#2d3748',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
  switchText: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  switchLink: {
    color: '#f37500',
    fontWeight: '600',
  },
  otpSection: {
    marginTop: 20,
    backgroundColor: '#111318',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f37500',
  },
  otpHelper: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 12,
    marginTop: 4,
  }
});
