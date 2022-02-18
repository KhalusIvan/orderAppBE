const { User } = require("../models");
const secretJWT = process.env.SECRET_JWT;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { transporter } = require("../helpers/transporter.helper");

const middleware = async (req, res, next) => {
  if (req.path.startsWith("/auth") && !req.path.startsWith("/auth/confirm"))
    return next();

  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Exclude authorization header" });
  }

  const token = authHeader.replace("Bearer ", "");
  try {
    const currentUser = jwt.verify(token, secretJWT);
    req.user = currentUser;
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Incorrect token" });
    }
  }
  next();
};

const registration = async (req, res) => {
  try {
    if (
      !req.body.email ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.password ||
      !req.body.passwordRepeat
    ) {
      return res.status(406).json({ message: "Incorrect data" });
    }
    if (!req.body.password || req.body.password !== req.body.passwordRepeat) {
      return res.status(406).json({ message: "Repeated password" });
    }
    const users = await User.findOne({
      where: { email: req.body.email },
    });
    if (!users) {
      bcrypt.hash(req.body.password, 10, async function (err, hash) {
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          confirm: false,
        };
        const user = await User.create(newUser);
        jwt.sign(
          {
            id: user.id,
          },
          secretJWT,
          {
            expiresIn: "7d",
          },
          (err, emailToken) => {
            const url =
              process.env.FRONT_END_URL + `/confirmation/${emailToken}`;
            let html_text = `Будь ласка перейдіть за <a href="${url}">даним посиланням</a>  щоб підтвердити Ваш e-mail адрес.`;
            let subject_text = "Підтвердження емайла";
            transporter.sendMail(
              {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: subject_text,
                html: html_text,
              },
              function (err, info) {
                if (err) {
                  console.log(err);
                  return res.status(406).json({ status: "error" });
                } else return res.json({ status: "confirm" });
              }
            );
          }
        );
      });
    } else {
      return res.status(406).json({ message: "Taken email" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const confirmation = async (req, res) => {
  try {
    await User.update(
      { confirm: true },
      {
        where: { id: req.user.id },
      }
    );
    return res.json({ status: "success" });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const signIn = async (req, res) => {
  try {
    if (!req.body.password || !req.body.email) {
      res.status(406).json({ message: "Information" });
      return;
    }
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      if (!user.confirm) {
        return res.status(406).json({ message: "Not verified" });
      } else {
        const token = jwt.sign({ id: user.id }, secretJWT, {
          expiresIn: req.body.rememberMe ? "30d" : "7d",
        });
        return res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            currentWorkspaceId: user.currentWorkspaceId,
          },
        });
      }
    } else {
      res.status(406).json({ message: "Not correct email or password" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const resetPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(406).json({ message: "Information" });
    }
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (user) {
      let new_password = "";
      while (new_password.length < 9)
        new_password += Math.random().toString(36).substring(2);
      new_password = new_password.substring(0, 9);
      jwt.sign(
        {
          id: user.id,
          password: new_password,
        },
        secretJWT,
        {
          expiresIn: "1d",
        },
        (err, emailToken) => {
          const url =
            process.env.FRONT_END_URL + `/reset_password/${emailToken}`;
          let html_text = `Ваш новий пароль ${new_password} </br> Будь ласка перейдіть за <a href="${url}">даним посиланням</a>  щоб підтвердити зміну паролю.`;
          let subject_text = "Підтвердження зміни пароля";
          transporter.sendMail(
            {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: subject_text,
              html: html_text,
            },
            function (err, info) {
              if (err) {
                console.log(err);
                return res.status(406).json({ status: "error" });
              } else return res.json({ status: "sended" });
            }
          );
        }
      );
    } else {
      res.status(406).json({ message: "Not correct email" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

const confirmPassword = async (req, res) => {
  try {
    if (!req.user.password) {
      return res.status(406).json({ status: "Invalid data" });
    }
    bcrypt.hash(req.user.password, 10, async function (err, hash) {
      const result = await User.update(
        { password: hash },
        {
          where: { id: req.user.id },
        }
      );
      return res.json({ status: "success" });
    });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  middleware,
  registration,
  signIn,
  resetPassword,
  confirmation,
  confirmPassword,
};
