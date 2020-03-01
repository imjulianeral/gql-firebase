import admin from 'firebase-admin'

import serviceAccount from './service-account.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// admin.auth().verifyIdToken()

const db = admin.firestore()

export { db }
