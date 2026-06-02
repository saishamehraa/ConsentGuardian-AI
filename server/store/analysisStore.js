//server/store/analysisStore.js
import mongoose from 'mongoose';

// 1. Define the Schema for a Scan Session
const analysisSchema = new mongoose.Schema({
  scanId: { type: String, required: true, unique: true },
  context: mongoose.Schema.Types.Mixed, 
  consentGaps: [mongoose.Schema.Types.Mixed],
  result: {
    projectName: String,
    scannedAt: Date,
    totalFiles: Number,
    totalIssues: Number,
    riskScore: Number,
    stats: {
      critical: Number,
      high: Number,
      medium: Number,
      low: Number
    },
    issues: [mongoose.Schema.Types.Mixed], 
    dataCollectionPoints: [mongoose.Schema.Types.Mixed],
    dataFlow: mongoose.Schema.Types.Mixed,
    regulatoryMapping: mongoose.Schema.Types.Mixed,
    predictiveForecast: mongoose.Schema.Types.Mixed
  },
  createdAt: { type: Date, default: Date.now }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

// 2. Connect to MongoDB Atlas
export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
  }
}

// 3. Export the exact same functions your API already uses
export async function saveAnalysis(scanId, analysisData) {
  try {
    // Upsert the data (create if it doesn't exist, update if it does)
    await Analysis.findOneAndUpdate(
      { scanId },
      { ...analysisData, scanId },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Failed to save analysis to DB:', error);
  }
}

export async function getAnalysis(scanId) {
  try {
    return await Analysis.findOne({ scanId }).lean();
  } catch (error) {
    console.error('Failed to retrieve analysis from DB:', error);
    return null;
  }
}