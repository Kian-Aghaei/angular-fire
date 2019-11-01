import * as admin from '../utils/admin';
import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
// import { region } from 'firebase-functions';
// import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore';

// const functionBuilder = region('europe-west1');

const db = admin.firestore();

export const addDateFunc = functions.region('europe-west1').https
  .onRequest(async (request, response) => {

    await db.collection('users').get()
      .then(resp => {
      console.log(resp.docs);
      const batch = db.batch();
      // const time = new firestore.Timestamp(1567299600, 0);
      const time = firestore.Timestamp.now();

      resp.docs.forEach(userDocRef => {
        batch.update(userDocRef.ref, {creationDateV2: time});
      });
      batch.commit().catch(err => console.error(err));
    }).catch(error => console.error(error));
    response.end();
  });

  // db.collection('users').get()
  //   .then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       const docRef = db.collection('users').doc(doc.id);
  //
  //       docRef.update({testField: 'DummyData!'});
  //       console.log('Document Updated!');
  //     })
  //   })
  //   .catch((error) => {
  //     console.error('Error updating document: ', error);
  //   });

