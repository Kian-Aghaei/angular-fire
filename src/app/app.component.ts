import {Component, OnInit} from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import {BehaviorSubject, Observable} from 'rxjs';
import * as firebase from "firebase";
import { switchMap, map } from 'rxjs/operators';

export interface Item { size: string; }
export interface User { name: string; creationDate: string; }


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private itemsCollection: AngularFirestoreCollection<Item>;
  private usersCollection: AngularFirestoreCollection<User>;
  items: Observable<Item[]>;
  displayItems: any;
  sizeFilter$: BehaviorSubject<string|null>;

  constructor(private afs: AngularFirestore) {
    this.usersCollection = afs.collection('users');
    this.sizeFilter$ = new BehaviorSubject(null);
    this.sizeFilter$
      .pipe(
      switchMap((size) =>
        afs.collection('items', ref => {
          let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
          if (size) { query = query.where('size', '==', size); }
          return query;
        }).valueChanges()
      )
    ).subscribe((data) => {
      console.log(data);
      this.displayItems = data;
    });

    // this.itemsCollection = afs.collection<Item>('items', ref => ref.where('size', '==', 'large'));
    // this.items = this.itemsCollection.valueChanges();
  }

  filterBySize(size: string|null) {
    this.sizeFilter$.next(size);
  }

  resetScore(): Promise<void> {
    return this.usersCollection.ref.get().then(resp => {
      console.log(resp.docs);
      const batch = this.afs.firestore.batch();

      resp.docs.forEach(userDocRef => {
        batch.update(userDocRef.ref, {testField: 'DummyDataV2!'});
      });
      batch.commit().catch(err => console.error(err));
    }).catch(error => console.error(error));
  }

  createNewDate() {
    const date = new Date(2019, 9, 1, 1, 0, 0);
    const time = new firebase.firestore.Timestamp(1567299600, 0);
    const converted = time.toDate();
    console.log('date:', date, 'converted:', converted);
  }

  ngOnInit(): void {
    this.filterBySize('large');
    this.createNewDate();
    // this.resetScore();

    // this.usersCollection.snapshotChanges().pipe(
    //   map(changes => { return  changes.map( a => {
    //     const data = a.payload.doc.data();
    //     const id = a.payload.doc.id;
    //     return {id, ...data};
    //   }); })
    // ).subscribe(users => {
    //   users.forEach( user => {
    //     this.afs.collection('users').doc(`user/${user.id}`).update({testFiled: 'dummyData'});
    //   });
    // });
  }

  //
  // public addItem(item: Item) {
  //   this.itemsDoc.add(item);
  // }

 }
