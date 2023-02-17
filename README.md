setTimeout(function () {
  console.log("First");
}, 3000);
console.log("Second");


exports.area = function (width) {
  return width * width;
};
exports.perimeter = function (width) {
  return 4 * width;
};


const server = app.listen(0420, function () {
 
    let host = server.address().address
    let port = server.address().port
   
    console.log("Backend Server running at http://%s:%s", host, port); 
  })
  

const square = require("./square"); // Here we require() the name of the file without the (optional) .js file extension
console.log(`The area of a square with a width of 4 is ${square.area(4)}`);


<!-- redirect back  -->
app.post('/quotes', (req, res) => {
  quotesCollection.insertOne(req.body)
    .then(result => {
      console.log(result)
    })
    .catch(error => console.error(error))
})


<!-- convert the data into an array. -->
app.get('/', (req, res) => {
  db.collection('quotes').find().toArray()
    .then(results => {
      console.log(results)
    })
    .catch(error => console.error(error))
  // ...
})

<!-- get data -->
app.get('/', (req, res) => {
  const cursor = db.collection('quotes').find()
  console.log(cursor)
  // ...
})