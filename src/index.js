/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
 */

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo para criar ou editar  um recurso (JSON)
 */

/** Middleware:
 * 
 * Interceptador de requisições que pode interromper uma requisição
 * ou alterar dados de uma requisição 
*/

const express = require('express');
const { uuid, isUuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
/** 
  A linha abaixo aplica o midlleware para todas as rotas iniciadas
  por /projects/:id (Alteração e deleção).
  Com ela poderia ser retirado o nome da função dos métodos put e delete
*/
app.use('/listagem/:id', validateProjectId);

const listagem = [];

// Função que mostra logs para exemplificar midlleware
function logRequests(request, response, next) {
  const {method, url} =request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);

  next();

}

app.use(logRequests); // Chama a função (midlleware) logRequests

function validateProjectId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)) 
     return (response.status(400).json({ error: 'Invalid project ID. (Middleware)' }));

  return next();

}

// Listagem de projetos
app.get('/listagem', (request, response) => {
  const { name, email } = request.query;

  // Filtro (Query inserida no insomnia) por name
  results = name ?
  listagem.filter(project => project.name.includes(name)) :
  listagem;

  // Filtro (Query inserida no insomnia) por email
  results = email ?
    results.filter(project => project.email.includes(email)) :
    results;

  return response.json(results);
});

// Inclusão de projetos
app.post('/listagem', (request, response) => {
  const { name, email } = request.body;
  const id = uuid();

  const project = { id, name, email };
  listagem.push(project);

  return response.json(project);
});

// Alteração de projetos
app.put('/listagem/:id', validateProjectId, (request, response) => {
  const { id } = request.params;
  const { name, email } = request.body;

  projectIndex = listagem.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not Found'});
  }

  const project = { id, name, email };

  listagem[projectIndex] = project;

  return response.json(project);
});

// Deleção de projetos
app.delete('/listagem/:id', validateProjectId, (request, response) => {
  const { id } = request.params;

  projectIndex = listagem.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: 'Project not Found'});
  }

  listagem.splice(projectIndex, 1);

  return response.json({ 'delete': 'Successfully' });

});

app.listen(3030, () => {
  console.log('Servidor iniciado.')
});