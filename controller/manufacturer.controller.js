const { Manufacturer, Role, Currency, WorkspaceUser } = require("../models");
const { Op } = require("sequelize");
const { getUserCurrentWorkspace } = require("./user.controller");

const getManufacturers = async (req, res) => {
  try {
    let result;
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE;
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE;
      result = await Manufacturer.findAndCountAll({
        include: [
          { model: Workspace, as: "workspace" },
          { model: Role, as: "role", attributes: ["id", "name"] },
        ],
        where: { userId: req.user.id },
        limit,
        offset,
        attributes: ["id"],
      });
      result.pages = Math.ceil(result.count / limit);
    } else {
      result = await WorkspaceUser.findAll({
        include: [
          { model: Workspace, as: "workspace" },
          { model: Role, as: "role", attributes: ["id", "name"] },
        ],
        where: { userId: req.user.id },
        attributes: ["id"],
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
      return res.status(406).json({ message: "Incorrect data" });
    const isCurrency = await Currency.findByPk(req.body.currencyId);
    if (!isCurrency)
      return res.status(406).json({ message: "Incorrect currency" });

    const workspaceId = await getUserCurrentWorkspace(req.user.id);

    const sameManufacturer = await Manufacturer.findOne({
      where: { name: req.body.name, workspaceId: workspaceId },
    });

    if (sameManufacturer) return res.status(406).json({ message: "Used name" });
    const manufacturer = await Manufacturer.create({
      name: req.body.name,
      currencyId: req.body.currencyId,
      workspaceId,
    });
    return res.json(manufacturer);
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const updateManufacturerById = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(406).json({ message: "Incorrect data" });
    const sameName = await Workspace.findOne({
      where: { id: { [Op.not]: req.params.id }, name: req.body.name },
    });
    if (sameName) return res.status(406).json({ message: "Used name" });
    const workspace = await Workspace.update(
      { name: req.body.name },
      {
        where: { id: req.params.id },
      }
    );
    return res.json(workspace);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getManufacturers,
  createManufacturer,
  updateManufacturerById,
};
