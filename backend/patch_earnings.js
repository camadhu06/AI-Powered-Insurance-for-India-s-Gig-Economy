/**
 * patch_earnings.js — One-time DB fix
 *
 * Problem: The registration form collected "Average Weekly Earnings"
 * but stored it directly as `avgDailyEarnings` without dividing by 7.
 *
 * Fix: For every user whose avgDailyEarnings > 500 (a safe heuristic —
 * no one earns ₹500+/day in this dataset unless the number was weekly),
 * divide the stored value by 7 and write it back.
 *
 * Run once from the backend directory:
 *   node patch_earnings.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const THRESHOLD = 500; // ₹/day — values above this are almost certainly weekly figures

const userSchema = new mongoose.Schema({
  name:             String,
  phone:            String,
  avgDailyEarnings: Number,
  planName:         String,
  weeklyPremium:    Number,
  city:             String,
}, { strict: false });

const User = mongoose.model('User', userSchema);

async function patch() {
  console.log('\n🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected.\n');

  // Fetch all users with suspiciously high daily earnings
  const users = await User.find({ avgDailyEarnings: { $gt: THRESHOLD } });

  if (users.length === 0) {
    console.log('🎉 No users need patching — all records look correct!');
    await mongoose.disconnect();
    return;
  }

  console.log(`🔍 Found ${users.length} user(s) to patch:\n`);

  let patched = 0;
  for (const user of users) {
    const oldVal = user.avgDailyEarnings;
    const newVal = Math.round(oldVal / 7);

    console.log(`  👤 ${user.name} (${user.city || 'unknown city'})`);
    console.log(`     avgDailyEarnings: ₹${oldVal} → ₹${newVal}`);

    await User.updateOne(
      { _id: user._id },
      { $set: { avgDailyEarnings: newVal } }
    );
    patched++;
  }

  console.log(`\n✅ Patched ${patched} record(s) successfully.`);
  console.log('💾 All changes saved to MongoDB.\n');
  await mongoose.disconnect();
}

patch().catch(err => {
  console.error('❌ Patch failed:', err.message);
  process.exit(1);
});
