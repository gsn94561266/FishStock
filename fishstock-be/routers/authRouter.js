const express = require('express');
const router = express();
const { body, validationResult } = require('express-validator');
const pool = require('../utils/db');
const argon2 = require('argon2');
const passport = require('passport');

const registerRules = [
  body('email').isEmail().withMessage('請輸入有效的 Email'),
  body('name').notEmpty().withMessage('請輸入姓名'),
  body('password').isLength({ min: 6 }).withMessage('密碼長度至少為 6 個字元'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('確認密碼與密碼不符'),
];

// /auth
router.post('/register', registerRules, async (req, res) => {
  try {
    // 後端驗證
    const validateResult = validationResult(req);
    if (!validateResult.isEmpty()) {
      return res.status(400).json({ message: validateResult.array() });
    }
    // 檢查 email 是否已經註冊
    let [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [
      req.body.email,
    ]);
    if (users.length > 0) {
      return res
        .status(400)
        .json({ message: [{ msg: 'email 已經註冊', path: 'email' }] });
    }
    // 雜湊密碼
    const hashPassword = await argon2.hash(req.body.password);
    // 存到資料庫
    let [result] = await pool.execute(
      'INSERT INTO users (email, password, name) VALUES (?,?,?)',
      [req.body.email, hashPassword, req.body.name]
    );
    res.json({ email: req.body.email, user_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json('發生錯誤');
  }
});

router.post('/login', async (req, res) => {
  try {
    // 確認 email 是否存在
    let [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [
      req.body.email,
    ]);
    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: [{ msg: 'email 尚未註冊', path: 'email' }] });
    }
    // 比對密碼
    let user = users[0];
    let result = await argon2.verify(user.password, req.body.password);
    if (result === false) {
      return res.status(401).json({
        message: [
          {
            msg: '帳號或密碼錯誤',
            path: 'password',
          },
        ],
      });
    }
    let returnUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };
    req.session.user = returnUser;
    res.json({ msg: 'ok', user: returnUser });
  } catch (error) {
    console.error(error);
    res.status(500).json('發生錯誤');
  }
});

router.get('/login/failed', (req, res) => {
  res.status(401).json({ msg: '登入失敗' });
});
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
    prompt: 'select_account',
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed',
    session: false,
  })
);

// 忘記密碼
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const moment = require('moment');
const resetTokens = {};
// 配置 nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'gsn94561266@gmail.com',
    pass: process.env.EMAIL_PASSWORD,
  },
});
// 忘記密碼請求
router.post('/forgot-password', async (req, res) => {
  try {
    // 確認 email 是否存在
    let [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [
      req.body.email,
    ]);
    if (users.length === 0) {
      return res
        .status(401)
        .json({ message: [{ msg: 'email 尚未註冊', path: 'email' }] });
    }
    const email = req.body.email;
    // 生成重置密鑰
    const token = uuid.v4();
    // 設定密鑰的過期時間
    const expirationTime = moment().add(1, 'minutes');
    // 將重置密鑰與用戶的 email 關聯
    resetTokens[token] = {
      email,
      expirationTime,
    };
    req.session.resetToken = resetTokens;
    // 建構重置連結
    const resetLink = `${process.env.CLIENT_URL}/reset?token=${token}`;
    // 建構 email 内容
    const mailOptions = {
      from: 'gsn94561266@gmail.com',
      to: email,
      subject: '魚股市重置密碼',
      text: `請點擊以下連結重置您的密碼，1分鐘後連結將失效：${resetLink}`,
    };
    // 發送 email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: [{ msg: '發送重置連結失敗', path: 'email' }] });
      } else {
        console.log('重置連結已發送至用戶信箱');
        res.status(200).json({
          message: [{ msg: '重置密碼連結已發送至您的電子郵件', path: 'email' }],
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json('發生錯誤');
  }
});

const resetRules = [
  body('password').isLength({ min: 6 }).withMessage('密碼長度至少為 6 個字元'),
  body('confirmPassword')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('確認密碼與密碼不符'),
];
// 重置密碼請求
router.post('/reset-password', resetRules, async (req, res) => {
  try {
    // 後端驗證
    const validateResult = validationResult(req);
    if (!validateResult.isEmpty()) {
      return res.status(400).json({ message: validateResult.array() });
    }
    // 檢查重置密鑰是否有效
    const { token } = req.body;
    const resetTokens = req.session.resetToken;
    const resetToken = resetTokens[token];
    const { email, expirationTime } = resetToken;
    if (!email) {
      res.status(400).json({
        message: [{ msg: '無效的連結，請重新申請', path: 'resetMessage' }],
      });
      return;
    }
    // 檢查重置密鑰是否已過期
    if (moment().isAfter(expirationTime)) {
      delete req.session.resetToken;
      res.status(400).json({
        message: [{ msg: '連結已過期，請重新申請', path: 'resetMessage' }],
      });
      return;
    }
    // 更新用戶密碼
    const hashPassword = await argon2.hash(req.body.password);
    await pool.execute('UPDATE users SET password = ? WHERE email = ?', [
      hashPassword,
      email,
    ]);
    // 刪除重置密鑰
    delete req.session.resetToken;
    res.status(200).json({
      message: [{ msg: '密碼重置成功', path: 'resetMessage' }],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: [{ msg: '無效的連結，請重新申請', path: 'resetMessage' }],
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.save(() => {
    res.status(202).end();
  });
});

module.exports = router;
