import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init goes here
const config = {
    apiKey: "AIzaSyB2BG0ugKjJBCd7xBBE86Zl56BwtuMT3HU",
    authDomain: "cartonplein-d4cf1.firebaseapp.com",
    databaseURL: "https://cartonplein-d4cf1.firebaseio.com",
    projectId: "cartonplein-d4cf1",
    storageBucket: "cartonplein-d4cf1.appspot.com",
    messagingSenderId: "539172165687"
}
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
    timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const ordersCollection = db.collection('orders')
//const commentsCollection = db.collection('comments')
//const likesCollection = db.collection('likes')

export {
    db,
    auth,
    currentUser,
    usersCollection,
    ordersCollection,
    //commentsCollection,
    //likesCollection
}