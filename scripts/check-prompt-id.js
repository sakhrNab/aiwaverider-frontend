/**
 * Check if a specific AI Tool ID exists in the database
 * 
 * This script checks if the prompt ID exists in your Firestore database
 */

const admin = require('firebase-admin');
const path = require('path');

// Path to your Firebase service account key file
// IMPORTANT: Update this path to your service account key file
const serviceAccountPath = path.join(__dirname, '../firebase-credentials.json');

// The ID to check
const PROMPT_ID = 'aNlBYTxPgXlDAKQkyEWP';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(require(serviceAccountPath))
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    process.exit(1);
  }
}

// Check if document exists
async function checkPromptId() {
  try {
    const docRef = admin.firestore().collection('ai_tools').doc(PROMPT_ID);
    const doc = await docRef.get();
    
    if (doc.exists) {
      console.log('✅ Document exists!');
      console.log('Document data:', doc.data());
    } else {
      console.log('❌ Document does not exist!');
      console.log('Let\'s check all available documents in the collection:');
      
      const snapshot = await admin.firestore().collection('ai_tools').limit(10).get();
      if (snapshot.empty) {
        console.log('No documents found in the collection.');
      } else {
        console.log('Available documents:');
        snapshot.forEach(doc => {
          console.log(`- ${doc.id}: ${doc.data().title}`);
        });
      }
    }
  } catch (error) {
    console.error('Error checking document:', error);
  }
}

// Run the check
checkPromptId().then(() => {
  console.log('Check completed.');
  process.exit(0);
});
