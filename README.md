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
tasks 


${currentDate}

    published: req.body.published ? req.body.published : false


    res.status(200).json({
        c: 200,
        m: "Hello World!",
        d: {}
    });

setTimeout(function () {
  console.log("First");
}, 3000);
console.log("Second");

var app = express()
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))


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

// Get all causes
export function getAllCause({
  Cause.find()
    .select('_id title description')
    .then((allCause) => {
      return res.status(200).json({
        success: true,
        message: 'A list of all causes',
        Cause: allCause,
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again.',
        error: err.message,
      });
    });
}


  const editRole = document.querySelectorAll('.edit')
  const deleteUser = document.querySelector('.delete')
  deleteUser.forEach((button, i)=> {
   button.addEventListener('click', async ()=> {
   display.textContent =''
   const id = data.user[i+1].id
   const res = await fetch('/api/auth/deleteUser', {
     method: 'DELETE',
     body: JSON.stringify({id}),
     headers: {'Content-Type': 'application/json'}
     })
   const dataDelete = await res.json()
   if (res.status === 401){
     document.body.scrollTop = 0
     document.documentElement.scrollTop = 0
     return display.textContent = `${dataUpdate.message}. ${dataUpdate.error ? dataUpdate.error : ''}`
   }
   location.assign('/admin')
    })
  })