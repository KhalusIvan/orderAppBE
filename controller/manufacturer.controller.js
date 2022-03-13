const { Manufacturer, Currency, Item } = require("../models");
const { Op } = require("sequelize");
const { getUserCurrentWorkspace } = require("./user.controller");

const getManufacturers = async (req, res) => {
  try {
    let result;
    const workspaceId = await getUserCurrentWorkspace(req.user.id);
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE;
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE;
      result = await Manufacturer.findAndCountAll({
        include: [{ model: Currency, as: "currency" }],
        where: { workspaceId: workspaceId },
        limit,
        offset,
        attributes: ["id", "name"],
      });
      result.pages = Math.ceil(result.count / limit);
    } else {
      result = await Manufacturer.findAll({
        include: [{ model: Currency, as: "currency" }],
        where: { workspaceId: workspaceId },
        attributes: ["id", "name"],
      });
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createManufacturer = async (req, res) => {
  try {
    if (!req.body.name || !req.body.currencyId)
      return res.status(406).json({
        severity: "error",
        text: "Введено некоректні інформацію!",
      });
    const isCurrency = await Currency.findByPk(req.body.currencyId);
    if (!isCurrency)
      return res.status(406).json({
        severity: "error",
        text: "Введено некоректні інформацію!",
      });

    const workspaceId = await getUserCurrentWorkspace(req.user.id);

    const sameManufacturer = await Manufacturer.findOne({
      where: { name: req.body.name, workspaceId: workspaceId },
    });

    if (sameManufacturer)
      return res.status(406).json({
        severity: "error",
        text: "Дана назва вже використовується!",
      });
    const manufacturer = await Manufacturer.create({
      name: req.body.name,
      currencyId: req.body.currencyId,
      workspaceId,
    });
    return res.json({
      severity: "success",
      text: "Успішно додано!",
      manufacturer,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const updateManufacturerById = async (req, res) => {
  try {
    if (!req.body.name && !req.body.currencyId)
      return res.status(406).json({
        severity: "error",
        text: "Введено некоректні інформацію!",
      });
    const update = {};
    if (req.body.currencyId) {
      const isCurrency = await Currency.findByPk(req.body.currencyId);
      if (!isCurrency)
        return res.status(406).json({
          severity: "error",
          text: "Введено некоректні інформацію!",
        });
      update.currencyId = req.body.currencyId;
    }

    const workspaceId = await getUserCurrentWorkspace(req.user.id);
    if (req.body.name) {
      const sameName = await Manufacturer.findOne({
        where: {
          name: req.body.name,
          workspaceId: workspaceId,
          id: { [Op.not]: req.params.id },
        },
      });
      if (sameName)
        return res.status(406).json({
          severity: "error",
          text: "Дана назва вже використовується!",
        });
      update.name = req.body.name;
    }

    const manufacturer = await Manufacturer.update(update, {
      where: { id: req.params.id },
    });
    return res.json({
      severity: "success",
      text: "Успішно оновлено!",
      manufacturer,
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteManufacturer = async (req, res) => {
  try {
    const item = await Item.findOne({
      where: { manufacturerId: req.params.id },
    });
    if (item)
      return res.status(406).json({
        severity: "error",
        text: "Видалення неможливе!",
      });
    await Manufacturer.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({
      severity: "success",
      text: "Успішно видалено!",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getManufacturers,
  createManufacturer,
  updateManufacturerById,
  deleteManufacturer,
};
