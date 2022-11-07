const database = require("./database");

const getUsers = (req, res) => {
    database
      .query("select * from users")
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

  module.exports = {
    getUsers,
    getUsersById,
    postUsers,
    putUser
  };