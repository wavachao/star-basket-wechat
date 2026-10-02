# 接住小星星 · Star Basket

一个原创、竖屏、单机的微信小游戏。左右拖动篮子接星星、避开石头；每局 60 秒，三颗心，保存本机最高分。微信与电脑浏览器共用玩法和画面代码，无外部运行依赖。

## 立即游玩

安装 Node.js 18 或更新版本，在项目目录运行：

```powershell
npm run preview
```

打开 http://127.0.0.1:4173 。电脑使用鼠标拖动，触屏设备左右滑动。第一次触摸后才启动音频；音效可关闭。浏览器预览用于快速验证，微信实机体验仍需开发者工具扫码检查。

## 构建与验证

```powershell
npm run test
npm run check
npm run build
npm run package
```

构建输出：`dist/wechat` 是微信项目；`dist/preview` 是浏览器版本。`preview/bundle.js` 自动生成，不必手工修改。无需运行 `npm install`。

项目已配置你提供的小游戏 AppID `wx05c79716747c9ea7`。直接构建即可，也可明确指定：

微信开发者工具已成功导入此 AppID，生成真机预览并上传 1.0.0 开发版本。正式上线还需真机验收、后台提审与审核后的发布。

```powershell
npm run build -- --appid wx05c79716747c9ea7
```

也可设置环境变量 `WECHAT_APPID`。参数优先于环境变量，不会修改源配置。`touristappid` 可用作本地预览占位值，不能用于正式上传。

在微信开发者工具中导入 `dist/wechat`，选择小游戏类型。用管理员或开发者微信登录，检查模拟器，再扫码真机预览。真实 AppID、账号权限、后台资料及审核通过后才能发布；生成代码包并不代表已经上线。

## 项目结构

- `game.js`：微信及浏览器共同入口。
- `src/core.js`：计时、掉落、碰撞、分数与状态。
- `src/renderer.js`：Canvas 绘制、适配和按钮命中。
- `src/main.js`、`src/platform.js`：启动、输入、生命周期、存储与音效。
- `tools/`：不依赖第三方包的构建、预览和检查工具。
- `tests/`：玩法与平台验证。
- `docs/RELEASE.md`：从导入到正式发布的步骤与实机验收。
- `docs/STORE.md`：可用于后台的名称、简介、玩法及自审草稿。
- `docs/PRIVACY.md`：与当前代码行为对应的隐私说明草稿。

## 首版边界

没有广告、付费、登录、排行榜、聊天、云存储、埋点、自建服务器或远程素材。不会请求头像、昵称、手机号、位置、相册或通讯录权限。最高分与音效选择保存在当前设备的本地存储，不跨设备同步。

页面与绘制元素为项目原创代码；平台要求的主体资料、运营联系方式和资质必须由实际运营者提供。

首版交付 ZIP 为 `dist/star-basket-wechat-1.0.0.zip`，解压后导入其中的 `wechat` 目录。图标为 `assets/icon.png`；实际画面截图位于 `release-assets/screenshots`。验证结果见 `docs/TEST-REPORT.md`。
