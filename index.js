const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dbConnection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "flight_db",
});

// POST endpoint to handle form submission for no_insurance
app.post("/api/addPassenger", (req, res) => {
  const {
    fullname,
    dob,
    ss_number,
    e_number,
    phone_number
  } = req.body;




  // Insert data into the MySQL database of no_insurance
  const sql = "INSERT INTO passengers (fullname, dob, ss_number, e_number, phone_number) VALUES (?, ?, ?, ?, ?)";
  dbConnection.query(sql, [fullname, dob, ss_number, e_number, phone_number], (err, result) => {
      if (err) {
          console.error("Error inserting data into database:", err);
          res.status(500).send("Internal Server Error");
      } else {
          console.log("Data inserted into database successfully");
          res.status(200).send("Data inserted successfully");
      }
  });
});


// GET endpoint to retrieve passenger data by ID
app.get("/api/getPassenger/:id", (req, res) => {
  const passengerId = req.params.id;

  const sql = "SELECT * FROM passengers WHERE id = ?";
  dbConnection.query(sql, [passengerId], (err, result) => {
    if (err) {
      console.error("Error retrieving passenger data from database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.length > 0) {
        const passengerData = result[0];
        res.status(200).json(passengerData);
      } else {
        res.status(404).send("Passenger not found");
      }
    }
  });
});

// PUT endpoint to update passenger data by ID
app.put("/api/updatePassenger/:id", (req, res) => {
  const passengerId = req.params.id;
  const {
    fullname,
    dob,
    ss_number,
    e_number,
    phone_number
  } = req.body;

  const sql = "UPDATE passengers SET fullname = ?, dob = ?, ss_number = ?, e_number = ?, phone_number = ? WHERE id = ?";
  dbConnection.query(sql, [fullname, dob, ss_number, e_number, phone_number, passengerId], (err, result) => {
    if (err) {
      console.error("Error updating passenger data in database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.affectedRows > 0) {
        console.log("Passenger data updated successfully");
        res.status(200).send("Passenger data updated successfully");
      } else {
        res.status(404).send("Passenger not found");
      }
    }
  });
});

// Fetch all passengers from the database
app.get('/api/getPassengers', (req, res) => {
  const sql = 'SELECT * FROM passengers';

  dbConnection.query(sql, (err, result) => {
      if (err) {
          console.error('Error fetching speeding:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.status(200).json(result);
      }
  });
});



// DELETE endpoint to delete passenger by ID
app.delete("/api/deletePassenger/:id", (req, res) => {
  const passengerId = req.params.id;

  const sql = "DELETE FROM passengers WHERE id = ?";
  dbConnection.query(sql, [passengerId], (err, result) => {
    if (err) {
      console.error("Error deleting passenger from database:", err);
      res.status(500).send("Internal Server Error");
    } else {
      if (result.affectedRows > 0) {
        console.log("Passenger deleted successfully");
        res.status(200).send("Passenger deleted successfully");
      } else {
        res.status(404).send("Passenger not found");
      }
    }
  });
});


//*** starting the server 3 ***//
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
