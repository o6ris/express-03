const movies = [
  {
    id: 1,
    title: "Citizen Kane",
    director: "Orson Wells",
    year: "1941",
    colors: false,
    duration: 120,
  },
  {
    id: 2,
    title: "The Godfather",
    director: "Francis Ford Coppola",
    year: "1972",
    colors: true,
    duration: 180,
  },
  {
    id: 3,
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    year: "1994",
    color: true,
    duration: 180,
  },
];

const database = require("./database");

const getMovies = (req, res) => {
  database
    .query("select * from movies")
    .then(([movies]) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getMovieById = (req, res) => {
  const movieid = parseInt(req.params.id);

  // const movie = movies.find((movie) => movie.id === id);

  database
    .query("select * from movies where id = ?", [movieid])
    .then(([movie]) => {
      if(movie.length>0){
        res.status(200).json(movie);
        console.log(movie)
      } else {
        res.status(404).send("Not found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postMovies = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      const id = parseInt(result.insertId)
      console.log(result)
      res.location(`./api/movies/${id}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const putMovie = (req, res) => {

  database
    .query(
      "UPDATE movies SET ? WHERE id = ?", [req.body, req.params.id]
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

const deleteMovie = (req, res) => {

  database
    .query(
      "DELETE FROM movies WHERE id = ?", [req.params.id]
    )
    .then(([result]) => {
      if(result.affectedRows === 0){
        res.status(404).send("Not Found");
      } else {
        res.status(200).send("Movie delete")
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error delete the movie");
    });

}


module.exports = {
  getMovies,
  getMovieById,
  postMovies,
  putMovie,
  deleteMovie
};
