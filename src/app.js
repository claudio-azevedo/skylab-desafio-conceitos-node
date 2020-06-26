//use express as framework
const express = require("express");

//allow cross-domain requests
const cors = require("cors");

//lib to generate/validade uuid
const { uuid, isUuid } = require("uuidv4");

//stat the app using express
const app = express();

//allow json as body requests
app.use(express.json());

//allow cross-domain requests
app.use(cors());

//middlewares
function validateUUID (request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({error: "Invalid repository ID"});
  }
  return next();
}


app.use('/repositories/:id', validateUUID);
app.use('/repositories/:id/like', validateUUID);

//start an const as a "database" just for test
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(), title, url, techs, likes: 0
  }
  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  const { likes } = repositories[repositoryIndex];

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found"})
  }
  const { title, url, techs } = request.body;

  const repository = { id, title, url, techs, likes};

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found"})
  }
  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const addLikes = 0;
  const repositoryIndex = repositories.findIndex(repo => repo.id == id);

  if (repositoryIndex < 0) {
    return response.status(400).json({error: "Repository not found"})
  }
  const { title, url, techs, likes }  = repositories[repositoryIndex];
  
  if (likes) {
    addlikes = likes +1;
  } else {
    addlikes = 1;
  }

  const repository = { id, title, url, techs, likes: addlikes};

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);

});

module.exports = app;
