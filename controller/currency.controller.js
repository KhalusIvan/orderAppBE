const { Currency, Manufacturer } = require('../models')
const axios = require('axios').default
const { Op } = require('sequelize')

const getCurrencies = async (req, res) => {
  try {
    const result = await Currency.findAll()
    return res.json(result)
  } catch (err) {
    return res.status(500).json(err)
  }
}

const updateCurrencyValues = async () => {
  try {
    const id = process.env.CURRENCY_ID
    /*const options = {
      method: 'GET',
      url: 'https://openexchangerates.org/api/latest.json',
      params: { app_id: id },
    }
    await axios
      .request(options)
      .then(async function (response) {
        const data = response.data
        const step = response.data.rates.UAH
        const result = Currency.findAll({}).then(async (rows) => {
          const currencies = rows.map((el) => el.dataValues)
          for await (let currency of currencies) {
            let update = {
              cost: (1 / response.data.rates[currency.code]) * step,
            }
            await Currency.update(update, {
              where: { id: currency.id },
            })
          }
        })
      })
      .catch(function (error) {
        console.error(error)
      })*/
  } catch (err) {
    console.log(err)
    return
  }
}

module.exports = {
  getCurrencies,
  updateCurrencyValues,
}
