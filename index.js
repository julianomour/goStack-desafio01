const express = require('express')

const server = express()

server.use(express.json())

let projects = []
let countRequisitions = 0

server.use((req, res, next) => {
  console.log(`Número de requisições feitas até agora: ${++countRequisitions}`)
  next()
})

function checkProject (req, res, next) {
  const {id} = req.params
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();

}

server.get('/projects', (req, res) => {
  res.json(projects)
})

server.post('/projects', (req, res) => {
  const project = req.body

  projects.push(project)
  
  res.json(projects)

})

server.put('/projects/:id', checkProject, (req, res) => {
  const {title} = req.body
  const { id } = req.params
  
  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
  

})

server.post('/projects/:id/tasks', checkProject, (req, res) => {
  const {title} = req.body
  const { id } = req.params

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json(project);
  
})


server.delete('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params

  const projectId = projects.findIndex(p => p.id == id);

  projects.splice(projectId, 1);

  return res.send();

})

server.listen(3000)