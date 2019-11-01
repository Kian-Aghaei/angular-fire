import * as admin from 'firebase-admin';

try {
  admin.initializeApp();
} catch (e) {
  console.log(e);
}

export = admin;
