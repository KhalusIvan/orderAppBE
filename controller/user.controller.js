const { User, Workspace } = require("../models");
const bcrypt = require("bcrypt");
const { getUserCurrencies } = require("./currency.controller");

const confirmation = async (req, res) => {
  try {
    await User.update(
      { confirm: true },
      {
        where: { id: req.user.id },
      }
    );
    return res.json({
      severity: "success",
      text: "Успішно підтверджено!",
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const confirmPassword = async (req, res) => {
  try {
    if (!req.user.password) {
      return res.status(406).json({
        severity: "error",
        text: "Введено некоректні інформацію!",
      });
    }
    bcrypt.hash(req.user.password, 10, async function (err, hash) {
      await User.update(
        { password: hash },
        {
          where: { id: req.user.id },
        }
      );
      return res.json({
        severity: "success",
        text: "Успішно змінений пароль!",
      });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const check = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      include: [
        {
          model: Workspace,
          as: "currentWorkspace",
        },
      ],
    });

    if (user) {
      return res.json({
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          currentWorkspace: user.currentWorkspace,
        },
        //currencies: await getUserCurrencies(user.currentWorkspace.id),
      });
    } else {
      res.status(401).json({});
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  confirmation,
  confirmPassword,
  check,
};
