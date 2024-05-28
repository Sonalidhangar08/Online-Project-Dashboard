import express from "express";
import mysql from "mysql";
import cors from "cors";
import path from "path";
import con from "./config.js"
import session from "express-session";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
  }
));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session(
  {
    secret: 'secretAS',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  }
))

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM users WHERE email = ? AND password = ?";
  con.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error executing query:", err);

      return res.json("fail to login");
    }
    if (result.length > 0) {
      req.session.username = result[0].email
      console.log(req.session.username);
      return res.json("success");
    }
    else {
      console.log("fail1");
      return res.json("fail");
    }
  });
});

app.get("/getProjects", (req, resp) => {
  con.query("select * from projects", (err, result) => {
    if (err) {
      resp.send("error");
    }
    else {
      resp.send(result);
    }
  })
});

app.post("/statusUpdate", (req, res) => {

  console.log(req.body)


  const { status, id } = req.body;

  const sql = `UPDATE projects SET status = ? WHERE id = ?`;
  con.query(sql, [status, id], (error, results) => {
    if (error) {
      console.error('Error updating column:', error);
      res.status(500).json({ error: 'Failed to update column' });
    } else {
      console.log('Column updated successfully');
      res.json({ success: true });
    }
  });
})

app.post("/register", (req, resp) => {
  const { name, email, password } = req.body;

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  const values = [name, email, password];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "Error inserting data" });
      return;
    }
    console.log("Data inserted successfully");
    resp.status(200).json({ message: "Data inserted successfully" });
  });
});

app.post("/addProject", (req, resp) => {
  const { theme,
    reason,
    type,
    division,
    category,
    priority,
    department,
    startDate,
    endDate,
    location,
    status } = req.body;

  const sql = "INSERT INTO projects (theme, reason, type, division, category, priority, department, startDate, endDate, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [theme,
    reason,
    type,
    division,
    category,
    priority,
    department,
    startDate,
    endDate,
    location,
    status];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);

      return resp.json("fail");
    }
    else {
      console.log("Data inserted successfully");
      return resp.json("sucess");

    }

  });

})

//protected routes
app.get('/dashboard', (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username })
  }
  else {
    return res.json({ valid: false })
  }

});

app.get('/createProject', (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username })
  }
  else {
    return res.json({ valid: false })
  }

});


app.get('/projectList', (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username })
  }
  else {
    return res.json({ valid: false })
  }

});
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    } else {
      res.send('Logout successful');
    }
  });
});

app.listen(5000, () => {
  console.log("server running");
})