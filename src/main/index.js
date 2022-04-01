const express = require('express')
const routes = require('../presentation/routes')

const app = express()
const PORT = 3333

app.use(express.json())
app.use(routes)

app.listen(PORT, () => {
  console.log(`>> [server] = Server is running at http://localhost:${PORT}`)
})
