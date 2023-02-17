LEAVE
ATTENDANCE
PAYROLL
Display Employee
Add Employee
Remove Employee
Promote Employee (Update Post)
Update Salary
time in/out
timesheet

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

<!-- SETTING UP FRONTEND -->
const loadPosts = async () => {
  let results = await fetch(`${baseUrl}/posts/latest`).then(resp => resp.json());
  setPosts(results);
}
let results = await fetch(`${baseUrl}/posts/`).then(resp => resp.json());
let results = await fetch(`${baseUrl}/posts/${params.id}`).then(resp => resp.json());

<!-- AWAIT -->
await fetch(`${baseUrl}/posts`, {
  method: "POST",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    author, title, tags: tags.split(","), body
  })
}).then(resp => resp.json());

<!-- Doing an update follows the same patterns but with a different method. -->
await fetch(`${baseUrl}/posts/comment/${params.id}`, {
  method: "PATCH",
  headers: {
    "content-type": "application/json"
  },
  body: JSON.stringify({
    author, body
  })
});

<!-- And the same is true for a delete request. -->
await fetch(`${baseUrl}/posts/${params.id}`, {
  method: "DELETE"
});



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

<!-- if valid -->
  // Validate required fields
  if (!valid) {
    return res.status(400).json({
      m: "Required Fields",
      c: 400,
      d: errors,
    });
  }

<!-- send html -->
  app.use("/", (req, res) => {
 res.sendFile(__dirname + "/index.html");
    // res.render("testing", { title: "About dogs", message: "Dogs rock!" });
    // res.sendFile(__dirname + '/index.html')
});