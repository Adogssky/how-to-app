# How to — 视觉升级 Demo

可运行的产品原型，展示 "How to" App 的全新视觉与交互。

## 视觉特点

- **柔和漂浮背景**：4 个低饱和度色块持续缓慢浮动
- **居中布局**：主要内容垂直居中，便于单手操作
- **大字体标题**：Display 字体 + 高字重，信息层级清晰
- **低饱和配色**：淡紫、淡蓝、淡绿、淡粉、淡黄等柔和色
- **卡片化设计**：每个界面用卡片承载信息，卡片带有轻微渐变和纹理
- **边缘浮窗菜单**：Workout 的 History / Body 从两侧边缘滑入
- **人体轮廓图**：Body 页面以人体 SVG 为核心，根据三大项数据改变线条粗细和颜色

## 功能流程

### 首页
- 进入后标题、副标题、选项、底部按钮依次淡入
- 选项为圆角胶囊按钮，居中排列
- 底部 **"I want more……"** 按钮放大居中，视觉权重更高

### How to build a bike
1. 选择 Road bike / Mountain bike
2. 展示完整 SVG 剪影
3. 点击部件查看信息、规格清单、购买清单
4. 点击规格后高亮，购买清单同步更新规格提示

### How to workout at a gym
- **Today**：卡片轮播展示训练动作
  - 添加动作 = 添加新卡片
  - 卡片可左右滑动切换
  - 当前卡片显示训练图片（尝试从数据集读取，失败显示 emoji）
  - 点击 **Start** 开始训练计时，全屏模态突出显示计时器，背景置灰
  - 点击 **Stop** 进入休息倒计时
  - 只能按顺序完成一组
- **History**：左侧边缘浮窗，日历视图 + 当天训练详情
- **Body**：右侧边缘浮窗，人体轮廓图 + profile + Big 3

### Body 人体轮廓
- 卧推 1RM 越高 → 上肢线条越粗、颜色越紫
- 深蹲 + 硬拉平均值越高 → 下肢线条越粗、颜色越绿
- Profile 和 Big 3 围绕人体图以图形化 pill 展示

### I want more……
- 底部大按钮进入
- 分步引导填写标题和功能描述
- AI 模拟生成，最多 3 次调整
- 提交后进入审核队列

### Admin 审核后台
- `admin.html`
- 审核提交内容，Approve 后出现在首页

## 如何运行

### Windows 浏览器
1. 打开 `how-to-app-demo` 文件夹
2. 双击 `index.html`
3. 按 `F12` 切换移动设备视图

### 安卓手机
```bash
cd how-to-app-demo
npx serve -l 3000
```
手机连同一 WiFi，访问电脑局域网 IP。

## 数据说明
- 浏览器 `localStorage` 存储：
  - `howto_body_profile`：身体数据
  - `howto_workouts`：训练记录
  - `howto_submissions`：UGC 提交
- 数据仅当前浏览器有效

## 外部训练动作数据集
尝试在线加载：
```
https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json
```
训练图片从：
```
https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/images/{image_id}.jpg
```
由于该数据集文件较大且部分网络环境受限，Demo 内置了 fallback 动作库和图片占位符。

## 项目结构
```
how-to-app-demo/
├── index.html
├── admin.html
├── css/style.css
├── js/app.js
└── README.md
```

## 封装 Android APK

本 Demo 已配置 [Capacitor](https://capacitorjs.com/) 打包脚本，需要在本地安装 Android Studio 与 Android SDK 后才能生成 APK。

### 环境要求
- Node.js 18+
- Android Studio (含 SDK、Gradle)
- 一部安卓手机或模拟器（可选）

### 构建步骤

```bash
cd how-to-app-demo

# 1. 安装 Capacitor 依赖
npm install

# 2. 添加 Android 平台
npx cap add android

# 3. 同步 Web 资源
npx cap sync android

# 4. 打开 Android Studio 项目
npx cap open android
```

在 Android Studio 中：
- 选择 Build → Build Bundle(s) / APK(s) → Build APK(s)
- 生成的 `.apk` 位于 `android/app/build/outputs/apk/debug/app-debug.apk`

或命令行直接构建：

```bash
cd android
./gradlew assembleDebug
```

## 后续可扩展
- 接入真实 LLM
- UGC 程序渲染为具体交互
- 服务端同步
- 原生 App 打包
