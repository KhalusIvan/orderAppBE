const { models } = require("../sequelize");

const getRoles = async (req, res) => {
  try {
    let result;
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE;
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE;
      result = await models.role.findAndCountAll({
        limit,
        offset,
      });
      result.pages = Math.ceil(result.count / limit);
    } else {
      result = await models.role.findAll();
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getRoleById = async (req, res) => {
  try {
    const result = await models.role.findByPk(req.params.id);
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const createRole = async (req, res) => {
  try {
    if (!req.body.name) {
      res.status(406).json({ message: "Incorrect data" });
      return;
    }
    const result = await models.role.create({
      name: req.body.name,
      default: !!req.body.default,
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateRoleById = async (req, res) => {
  try {
    const result = await models.role.update(req.body, {
      where: { id: req.params.id },
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const deleteRoleById = async (req, res) => {
  try {
    const foreign = await models.workspace_user.findOne({
      where: { roleId: req.params.id },
    });
    if (foreign) return res.status(406).json({ message: "Can't be deleted" });
    const result = await models.role.destroy({ where: { id: req.params.id } });
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRoleById,
  deleteRoleById,
};
