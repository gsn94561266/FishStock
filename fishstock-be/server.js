const express = require('express');
const app = express();
require('dotenv').config();
const pool = require('./utils/db');

const cors = require('cors');
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.json());

const expressSession = require('express-session');
const FileStore = require('session-file-store')(expressSession);
const path = require('path');
app.use(
  expressSession({
    store: new FileStore({
      path: path.join(__dirname, '..', 'sessions'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // 檢查 email 是否已經註冊
        let [users] = await pool.execute(
          'SELECT * FROM users WHERE email = ?',
          [profile.emails[0].value]
        );

        if (users.length > 0) {
          // email 已經註冊，執行登入邏輯
          let user = users[0];
          let returnUser = {
            id: user.id,
            name: user.name,
            email: user.email,
          };
          req.session.user = returnUser;
          done(null, returnUser);
        } else {
          // email 尚未註冊，執行註冊邏輯
          // 生成密碼
          const password = generatePassword();

          let [result] = await pool.execute(
            'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
            [profile.emails[0].value, password, profile.displayName]
          );

          let newUser = {
            id: result.insertId, // 使用 insertId 獲取新增的用戶id
            name: profile.displayName,
            email: profile.emails[0].value,
          };
          req.session.user = newUser;
          done(null, newUser);
        }
      } catch (error) {
        console.error(error);
        done(error);
      }
    }
  )
);

function generatePassword() {
  const length = 20;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }

  return password;
}

const finmindRouter = require('./routers/finmindRouter');
app.use('/finmind', finmindRouter);

const twseRouter = require('./routers/twseRouter');
app.use('/twse', twseRouter);

const authRouter = require('./routers/authRouter');
app.use('/auth', authRouter);

const userRouter = require('./routers/userRouter');
app.use('/user', userRouter);

app.use((req, res, next) => {
  console.log('這裡是 404');
  res.status(404).send('沒有這個網頁');
});

app.listen(5000, () => {
  console.log('Server running at port 5000');
});
