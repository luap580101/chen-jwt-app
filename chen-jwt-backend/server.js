// 引入需要的模組
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// 建立 Express 應用程式
const app = express();

// 使用中間件
app.use(cors()); // 啟用 CORS
app.use(express.json()); // 解析 JSON 請求

// JWT 密鑰（在實際應用中應該存儲在環境變數中）
const SECRET_KEY = "your_secret_key";

// 假資料庫
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// 路由範例
// 1. 基本首頁路由
app.get("/", (req, res) => {
  res.send("Welcome to the Express JWT Server!");
});

// 2. 登入路由，生成 JWT
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 驗證用戶名和密碼
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 生成 JWT
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// 3. 受保護的路由
app.get("/protected", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Welcome to the protected route!", user });
  });
});

// 啟動伺服器
const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
