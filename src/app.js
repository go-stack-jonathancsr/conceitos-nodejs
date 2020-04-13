const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(request, response, next){
  console.log(request.url);
  return next();
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories); 
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repo);

  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;

  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0){
     return response.status(400).json("Repository not found.");
  }

  const repo = {
    id: repositories[repoIndex].id,
    title,
    url,
    techs,
    likes: repositories[repoIndex].likes
  }

  repositories[repoIndex] = repo;

  return response.json(repo);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0){
     return response.status(400).json("Repository not found.");
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).json("Deleted");

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if(repoIndex < 0){
     return response.status(400).json("Repository not found.");
  }

  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex])
});

module.exports = app;
