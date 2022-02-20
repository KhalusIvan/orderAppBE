const { Currency, Manufacturer } = require("../models");
const axios = require("axios").default;
const { Op } = require("sequelize");

const getUserCurrencies = async (currentWorkspaceId) => {
  try {
    const currencies = await Currency.findAll({
      where: {
        code: { [Op.not]: "UAH" },
        "$manufacturers.workspaceId$": currentWorkspaceId,
      },
      include: [
        {
          model: Manufacturer,
          as: "manufacturers",
        },
      ],
    });
    const returnedCurrencies = [];
    for await (let currency of currencies) {
      const options = {
        method: "GET",
        url: process.env.CURRENCY_URL,
        params: { from: currency.code, to: "UAH", q: "1.0" },
        headers: {
          "x-rapidapi-host": process.env.CURRENCY_HOST,
          "x-rapidapi-key": process.env.CURRENCY_KEY,
        },
      };
      await axios
        .request(options)
        .then(function (response) {
          returnedCurrencies.push({ [currency.code]: response.data });
          console.log(response.data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    return returnedCurrencies;
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getCurrencies = async (req, res) => {
  try {
    const result = await Currency.findAll();
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getUserCurrencies,
  getCurrencies,
};
