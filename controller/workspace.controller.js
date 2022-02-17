const { models } = require("../sequelize");

const getWorkspaces = async (req, res) => {
  try {
    let result;
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE;
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE;
      result = await models.workspace.findAndCountAll({
        include: [
          { model: models.workspace_user, where: { userId: req.user.id } },
        ],
        limit,
        offset,
      });
      result.pages = Math.ceil(result.count / limit);
    } else {
      result = await models.workspace.findAll();
    }
    return res.json(result);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const getWorkspaceById = (req, res) => {
  res.status(400).send("Failed");
};

const createWorkspace = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(406).json({ message: "Incorrect data" });
    const workspacePrev = await models.workspace.findOne({
      where: { name: req.body.name },
    });
    if (workspacePrev) return res.status(406).json({ message: "Used name" });
    const workspace = await models.workspace.create({ name: req.body.name });
    const user = await models.user.findByPk(req.user.id);
    const defaultRole = await models.role.findOne({ where: { default: true } });
    const result = await user.addWorkspace(workspace, {
      through: { roleId: defaultRole.id },
    });
    return res.json(workspace);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateWorkspaceById = (req, res) => {
  res.status(400).send("Failed");
};

const deleteWorkspaceById = (req, res) => {
  res.status(400).send("Failed");
};

module.exports = {
  getWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspaceById,
  deleteWorkspaceById,
};
