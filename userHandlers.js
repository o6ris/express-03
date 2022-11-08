const database = require("./database");

const getUsers = (req, res) => {
  let sql = "select * from users";
  const sqlValues = [];
  console.log(req.query.language)
  if(req.query.language != null){
    sql += " where language = ?";
    sqlValues.push(req.query.language);

    if (req.query.city != null) {
      sql += " and city = ?";
      sqlValues.push(req.query.city);
    }
  } else if (req.query.city != null) {
    sql += " where city = ?";
    sqlValues.push(req.query.city);
  }
    database
      .query(sql, sqlValues)
      .then(([user]) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };
  
  const getUsersById = (req, res) => {
    const usersId = parseInt(req.params.id);
  
    database
      .query("select * from users where id = ?", [usersId])
      .then(([user]) => {
        if(user.length>0){
          res.status(200).json(user);
        } else {
          res.status(404).send("Not found");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error retrieving data from database");
      });
  };

  const postUsers = (req, res) => {
    const { firstname, lastname, email, city, language } = req.body;
  
    database
      .query(
        "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
        [firstname, lastname, email, city, language]
      )
      .then(([result]) => {
        const id = parseInt(result.insertId)
        console.log(result)
        res.location(`./api/users/${id}`).sendStatus(201);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving the user");
      });
  };

  const putUser = (req, res) => {

    database
      .query(
        "UPDATE users SET ? WHERE id = ?", [req.body, req.params.id]
      )
      .then(([result]) => {
        if(result.affectedRows === 0){
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(200)
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error update the movie");
      });
  }

  const deleteUser = (req, res) => {

    database
      .query(
        "DELETE FROM users WHERE id = ?", [req.params.id]
      )
      .then(([result]) => {
        if(result.affectedRows === 0){
          res.status(404).send("Not Found");
        } else {
          res.status(200).send("User delete")
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error delete the user");
      });
  
  }

  module.exports = {
    getUsers,
    getUsersById,
    postUsers,
    putUser,
    deleteUser
  };

  