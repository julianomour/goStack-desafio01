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
  projects.forEach(p => {
    if(p.id === id) {
      return next()
    }

    res.status(400).json({error: 'Project does not exists'})
  })

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
  
  projects.forEach(p => {
    if(p.id === id) {
      p.title = title
    }
  })
  
  res.json(projects)

})

server.post('/projects/:id/tasks', checkProject, (req, res) => {
  const {title} = req.body
  const { id } = req.params

  projects.forEach(p => {
    if(p.id === id) {
      p.tasks.push(title)
      return res.json(p)
    }
  })
})


server.delete('/projects/:id', checkProject, (req, res) => {
  const { id } = req.params

  const newProjectsArray = projects.filter((elem) => {
    return elem.id !== id
  })
  projects = newProjectsArray
  return res.json(projects)

})

server.listen(3000)