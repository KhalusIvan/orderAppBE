const dotenv = require('dotenv')
dotenv.config()
const nodeCron = require('node-cron')
const routes = require('./routes')
const sequelize = require('./sequelize')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { middleware } = require('./controller/auth.controller')
const { updateCurrencyValues } = require('./controller/currency.controller')
const PORT = process.env.PORT || 4000

const app = express()

app.use(cors())
app.use('/api', middleware)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/api', routes)

app.listen(PORT, function () {
  sequelize
    .authenticate()
    .then(async (res) => {
      updateCurrencyValues()
      const job = nodeCron.schedule(
        '0 * * * *',
        function jobYouNeedToExecute() {
          updateCurrencyValues()
          console.log(new Date().toLocaleString())
        },
      )
    })
    .catch((err) => console.log(err))
})
