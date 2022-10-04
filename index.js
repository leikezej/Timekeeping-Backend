const express = require("express");
const cors = require("cors");

const app = express();

const db = require("./models");
const Role = db.role;

// db.sequelize.sync();
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./routes/auth.routes');
require('./routes/user.routes');

const PORT = process.env.PORT || 272;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
}