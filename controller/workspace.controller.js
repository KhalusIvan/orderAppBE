const { Workspace, Role, User, WorkspaceUser } = require("../models");
const { Op } = require("sequelize");

const getWorkspaces = async (req, res) => {
  try {
    let result;
    if (req.query.page) {
      const limit = +process.env.ROWS_PER_PAGE;
      const offset = (+req.query.page - 1) * +process.env.ROWS_PER_PAGE;
      result = await Workspace.findAndCountAll({
        include: [{ model: Workspace_user, where: { userId: req.user.id } }],
        limit,
        offset,
      });
      result.pages = Math.ceil(result.count / limit);
    } else {
      result = await Workspace.findAll();
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
    const workspacePrev = await Workspace.findOne({
      where: { name: req.body.name },
    });
    if (workspacePrev) return res.status(406).json({ message: "Used name" });
    const workspace = await Workspace.create({ name: req.body.name });
    const user = await User.findByPk(req.user.id);
    const role = await Role.findOne({ where: { owner: true } });
    await User.update(
      { currentWorkspaceId: workspace.id },
      {
        where: { id: req.user.id },
      }
    );
    await WorkspaceUser.create({
      userId: user.id,
      roleId: role.id,
      workspaceId: workspace.id,
    });
    return res.json(workspace);
  } catch (err) {
    return res.status(500).json(err);
  }
};

const updateWorkspaceById = async (req, res) => {
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
