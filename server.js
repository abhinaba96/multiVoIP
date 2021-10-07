const express = require('express')
const app = express()
// const cors = require('cors')
// app.use(cors())
//const { initializeApp } = require('firebase/app');
//const { getFirestore, collection, getDocs } = require('firebase/firestore');
//import firebase from 'firebase/app'
const firebase = require('firebase/app');
const fbauth = require('firebase/auth');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCC2f8KTAlCE4fky9bcmH5Hv-YQ5UIoeV0",
  authDomain: "hindalcovoip.firebaseapp.com",
  projectId: "hindalcovoip",
  storageBucket: "hindalcovoip.appspot.com",
  messagingSenderId: "540108766878",
  appId: "1:540108766878:web:31b4172bc45c24d707858f",
  measurementId: "G-YFMMYZKYH7"
};

// Initialize Firebase
//const firebaseapp = initializeApp(firebaseConfig);
//app.use(firebaseapp);
firebase.initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);

const server = require('http').Server(app)
const io = require('socket.io')(server)
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
const { v4: uuidV4 } = require('uuid')

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // firebase.auth().onAuthStateChanged((obj) => {
  //   console.log(obj, "objval");
  //   res.redirect(`/${uuidV4()}`)
  //}) 
  //to do authenticate user here
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', (message) => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3030)
