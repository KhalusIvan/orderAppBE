const { User, Workspace, WorkspaceUser, Role } = require('../models')
const secretJWT = process.env.SECRET_JWT
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { transporter } = require('../helpers/transporter.helper')

const middleware = async (req, res, next) => {
  if (req.path.startsWith('/auth')) return next()

  const authHeader = req.get('Authorization')
  if (!authHeader) {
    return res.status(401).json({ message: 'Exclude authorization header' })
  }

  const token = authHeader.replace('Bearer ', '')
  try {
    const currentUser = jwt.verify(token, secretJWT)
    req.user = currentUser
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['currentWorkspaceId'],
    })
    req.user.workspaceId = user.currentWorkspaceId
    const userRole = await WorkspaceUser.findOne({
      where: {
        userId: req.user.id,
        workspaceId: req.user.workspaceId,
      },
      attributes: [],
      include: [{ model: Role, as: 'role' }],
    })
    req.user.role = userRole.dataValues.role.dataValues
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Incorrect token' })
    }
  }
  next()
}

const registration = async (req, res) => {
  try {
    if (
      !req.body.email ||
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.password ||
      !req.body.passwordRepeat
    ) {
      return res
        .status(406)
        .json({ severity: 'error', text: 'Введено некоректну інформацію!' })
    }
    if (!req.body.password || req.body.password !== req.body.passwordRepeat) {
      return res
        .status(406)
        .json({ severity: 'error', text: 'Повторний пароль не вірний!' })
    }
    const users = await User.findOne({
      where: { email: req.body.email },
    })
    if (!users) {
      bcrypt.hash(req.body.password, 10, async function (err, hash) {
        const newUser = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hash,
          confirm: false,
        }
        const user = await User.create(newUser)

        const workspace = await Workspace.create({ name: 'Дефолт' })
        const role = await Role.findOne({ where: { owner: true } })
        await WorkspaceUser.create({
          userId: user.id,
          roleId: role.id,
          workspaceId: workspace.id,
        })
        await User.update(
          { currentWorkspaceId: workspace.id },
          {
            where: { id: user.id },
          },
        )

        jwt.sign(
          {
            id: user.id,
          },
          secretJWT,
          {
            expiresIn: '90d',
          },
          (err, emailToken) => {
            const url =
              process.env.FRONT_END_URL + `/auth/confirmation/${emailToken}`
            let html_text = `Будь ласка перейдіть за <a href="${url}">даним посиланням</a>  щоб підтвердити Ваш e-mail адрес.`
            let subject_text = 'Підтвердження емайла'
            transporter.sendMail(
              {
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: subject_text,
                html: html_text,
              },
              function (err, info) {
                if (err) {
                  console.log(err)
                  return res.status(406).json({
                    severity: 'error',
                    text:
                      "Помилка надсилання повідомлення! Зв'яжіться з адміністратором!",
                  })
                } else
                  return res.json({
                    severity: 'success',
                    text: 'Лист-підтвердження надіслано на пошту!',
                  })
              },
            )
          },
        )
      })
    } else {
      return res.status(406).json({
        severity: 'error',
        text: 'Зайнятий емейл!',
      })
    }
  } catch (err) {
    return res.status(500).json(err)
  }
}

const signIn = async (req, res) => {
  try {
    console.log(req.body)
    if (!req.body.password || !req.body.email) {
      res
        .status(406)
        .json({ severity: 'error', text: 'Введено некоректну інформацію!' })
      return
    }
    const user = await User.findOne({
      where: { email: req.body.email },
      include: [{ model: Workspace, as: 'currentWorkspace' }],
    })
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      if (!user.confirm) {
        return res.status(406).json({
          severity: 'error',
          text: 'Підтвердіть користувача!',
        })
      } else {
        const token = jwt.sign({ id: user.id }, secretJWT, {
          expiresIn: req.body.rememberMe ? '30d' : '7d',
        })
        const userRole = await WorkspaceUser.findOne({
          where: { userId: user.id, workspaceId: user.currentWorkspace.id },
          attributes: [],
          include: [
            {
              model: Role,
              as: 'role',
            },
          ],
        })
        return res.json({
          token,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            currentWorkspace: {
              ...user.currentWorkspace.dataValues,
              role: userRole.role,
            },
          },
        })
      }
    } else {
      res.status(406).json({
        severity: 'error',
        text: 'Не вірний логін або пароль!',
      })
    }
  } catch (err) {
    return res.status(500).json(err)
  }
}

const resetPassword = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(406).json({
        severity: 'error',
        text: 'Введено некоректні інформацію!',
      })
    }
    const user = await User.findOne({
      where: { email: req.body.email },
    })
    if (user) {
      let new_password = ''
      while (new_password.length < 9)
        new_password += Math.random().toString(36).substring(2)
      new_password = new_password.substring(0, 9)
      jwt.sign(
        {
          id: user.id,
          password: new_password,
        },
        secretJWT,
        {
          expiresIn: '1d',
        },
        (err, emailToken) => {
          const url =
            process.env.FRONT_END_URL +
            `/auth/confirmation_password/${emailToken}`
          let html_text = `Ваш новий пароль ${new_password} </br> Будь ласка перейдіть за <a href="${url}">даним посиланням</a>  щоб підтвердити зміну паролю.`
          let subject_text = 'Підтвердження зміни пароля'
          transporter.sendMail(
            {
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: subject_text,
              html: html_text,
            },
            function (err, info) {
              if (err) {
                console.log(err)
                return res.status(406).json({
                  severity: 'error',
                  text:
                    "Помилка надсилання повідомлення! Зв'яжіться з адміністратором!",
                })
              } else
                return res.json({
                  severity: 'success',
                  text: 'Новий пароль надіслано на пошту!',
                })
            },
          )
        },
      )
    } else {
      res.status(406).json({
        severity: 'error',
        text: 'Введено некоректний емейл!',
      })
    }
  } catch (err) {
    return res.status(500).json(err)
  }
}

module.exports = {
  middleware,
  registration,
  signIn,
  resetPassword,
}
