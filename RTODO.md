trigger events when user logged in

const EventEmitter=require('events');
var eventEmitter=new EventEmitter();

eventEmitter.addListener(event, listener)
eventEmitter.on(event, listener)
eventEmitter.once(event, listener)

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
});


// Importing events
const EventEmitter = require('events');
  
// Initializing event emitter instances
var eventEmitter = new EventEmitter();
 
// Registering to myEvent
eventEmitter.on('myEvent', (msg) => {
   console.log(msg);
});
 
// Triggering myEvent
eventEmitter.emit('myEvent', "First event");



// Importing events
const EventEmitter = require('events');
 
// Initializing event emitter instances
var eventEmitter = new EventEmitter();
  
var fun1 = (msg) => {
    console.log("Message from fun1: " + msg);
};
  
var fun2 = (msg) => {
    console.log("Message from fun2: " + msg);
};
 
// Registering fun1 and fun2
eventEmitter.on('myEvent', fun1);
eventEmitter.on('myEvent', fun1);
eventEmitter.on('myEvent', fun2);
  
// Removing listener fun1 that was
// registered on the line 13
eventEmitter.removeListener('myEvent', fun1);
  
// Triggering myEvent
eventEmitter.emit('myEvent', "Event occurred");
 
// Removing all the listeners to myEvent
eventEmitter.removeAllListeners('myEvent');
 
// Triggering myEvent
eventEmitter.emit('myEvent', "Event occurred");

client.js

console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});


// add a document to the DB **collection** recording the click event
app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});

console.log('Client-side code running');

const button = document.getElementById('myButton');
button.addEventListener('click', function(e) {
  console.log('button was clicked');

  fetch('/clicked', {method: 'POST'})
    .then(function(response) {
      if(response.ok) {
        console.log('Click was recorded');
        return;
      }
      throw new Error('Request failed.');
    })
    .catch(function(error) {
      console.log(error);
    });
});


// add a document to the DB collection recording the click event
app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});


app.post('/login', express.urlencoded({ extended: false }), function (req, res) {
  // login logic to validate req.body.user and req.body.pass
  // would be implemented here. for this example any combo works

  // regenerate the session, which is good practice to help
  // guard against forms of session fixation
  req.session.regenerate(function (err) {
    if (err) next(err)

    // store user information in session, typically a user id
    req.session.user = req.body.user

    // save the session before redirection to ensure page
    // load does not happen before session is saved
    req.session.save(function (err) {
      if (err) return next(err)
      res.redirect('/')
    })
  })
})


// const button = document.getElementById('myButton');
// button.addEventListener('click', function(e) {
//   console.log('button was clicked');

//   fetch('/clicked', {method: 'POST'})
//     .then(function(response) {
//       if(response.ok) {
//         console.log('Click was recorded');
//         return;
//       }
//       throw new Error('Request failed.');
//     })
//     .catch(function(error) {
//       console.log(error);
//     });
// console.log('Client-side code running');
// });

app.post('/clicked', (req, res) => {
  const click = {clickTime: new Date()};
  console.log(click);
  console.log(db);

  db.collection('clicks').save(click, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('click added to db');
    res.sendStatus(201);
  });
});


const checkPolls = async () => {

    let today = new Date();
    let start = today.setUTCHours(0, 0, 0, 0);
    let end = today.setUTCHours(23, 59, 59, 59);  
    console.log("End", new Date(end), "start", new Date(start));
    const condition = {
        createdAt: { $gte: new Date(start), $lte: new Date(end) },
      };

      const poll_list = await services.getList(
        Poll,
        {status: approved, condition},
        {}
      );
      console.log("New User", poll_list);
      res.send({ success: true, data: poll_list });
    
    var job = new CronJob('* * * * * *', function() {
       checkPolls();
      }, null, true);
            job.start();
    }
Share
