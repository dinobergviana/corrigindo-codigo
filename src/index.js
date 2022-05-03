const { response } = require("express");
const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function verifyExistingRepository(request, reponse, next) {
  const { id } = request.params

  const repository = repositories.findIndex(repo => repo.id === id )

  if (repository < 0) {
    return response.status(404).json({ error: `Unable to find a repository with id: ${ id }`})
  }

  return next()
}

function verifyManuallyGiveLikeTry(request, response, next) {
  const { likes } = request.body

  if (likes) {
    request.body.likes = 0
  }

  return next()
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", verifyExistingRepository, verifyManuallyGiveLikeTry, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", verifyExistingRepository, (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", verifyExistingRepository, (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const likes = repositories[repositoryIndex].likes += 1;

  return response.json({ likes });
});

module.exports = app;
