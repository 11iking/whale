# 鲸鱼还账器 — Supabase 部署指南

两个用户、登录区分债主/欠账人、云端实时同步、逾期指数增长、自动欠条、债主确认清账。

---

## 一、注册 Supabase 项目（约5分钟，免费）

1. 打开 https://supabase.com ，点 Start your project，用 GitHub 账号登录。
2. 点 New project：Name 随便填；Database Password 设一个强密码并记下；Region 选离你近的（如 Singapore）。
3. 等 1~2 分钟创建完成。

## 二、建数据库表 + 安全策略

1. 进入项目后，左侧菜单 SQL Editor -> New query。
2. 打开本文件夹的 supabase/schema.sql，整段复制，粘贴运行（Run）。看到 Success 即完成。

这一步做了三件事：
- 建 debts（账单）和 repayments（还账记录）两张表
- 开启行级安全 RLS：只有账单的当事人（债主或欠账人）能读写自己的数据
- 开启 Realtime 实时同步

## 三、获取 API 密钥

1. 左侧 Project Settings（齿轮）-> API。
2. 找到 Project URL（形如 https://xxxxx.supabase.co）和 anon public key（eyJ... 开头）。

> 注意：用 anon public 那个 key，不要用 service_role key。anon key 配合 RLS 使用，即使泄露也无法越权。

## 四、填写到网页里

1. 用记事本 / VS Code 打开 index.html。
2. 找到这两行（在文件下半部分的 script 里）：

```js
const SUPABASE_URL="https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY="YOUR-ANON-KEY";
```

3. 换成真实的 URL 和 key，保存。

## 五、注册两个用户账号

1. 浏览器打开 index.html（手机或电脑都行）。
2. 用户 A（债主）：输入邮箱 + 密码（至少6位），点登录/注册 -> 自动注册。
3. 首次注册 Supabase 会发确认邮件，点链接激活。
4. 用户 B（欠账人）：同样方式注册另一个邮箱。

> 关闭邮件确认（方便测试）：Authentication -> Providers -> Email -> 关闭 Confirm email -> 保存。这样注册后无需点邮件链接，直接能登录。

## 六、开始使用

1. 用户 A 登录后，记一笔账：选对方为债主/欠账人、填原因、数目、部位、工具、DDL。
2. 提交后自动弹出一张欠条，可打印或保存 PDF。
3. 用户 B 登录后立刻看到这笔账（实时同步），可以还账。
4. 全部还清后进入待确认状态 -> 由债主本人输入邮箱确认 -> 才正式清账。
5. 逾期未还的账单，应还数目按 ⌈剩余 × (1+日利率)^逾期天数⌉ 每日复利增长。

## 七、托管上网（手机随时访问，推荐）

### 方式 A：GitHub Pages（免费，推荐）
1. GitHub 新建仓库，把 index.html 和 supabase/ 上传。
2. 仓库 Settings -> Pages -> Source 选 main 分支 -> Save。
3. 得到 https://用户名.github.io/仓库名/。手机打开，建议添加到主屏幕当 App 用。

### 方式 B：Netlify（拖拽即部署）
1. 打开 https://app.netlify.com/drop
2. 把整个文件夹拖进去，即时得到 HTTPS 网址。

### 方式 C：本地测试
直接双击 index.html 即可在浏览器打开测试。

## 八、安全说明

- 认证：Supabase 官方 auth，邮箱+密码，密码哈希存储、JWT token。
- 授权：数据库层 RLS 策略保证只有账单当事人能读写，匿名/他人一律拒绝。
- 传输：托管后全程 HTTPS。
- 密钥：前端只持有 anon public key，无 service_role 泄露风险。
- 两个用户：各注册各的账号，代码自动用邮箱区分谁是债主谁是欠账人。

## 文件说明

| 文件 | 作用 |
|------|------|
| index.html | 网页应用（唯一需要部署的文件） |
| supabase/schema.sql | 数据库建表 + 安全策略脚本 |
| SETUP.md | 本文档 |

有问题随时问我 🐋
