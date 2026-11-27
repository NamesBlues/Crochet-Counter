# 钩织计数器 · Crochet Counter

一个给钩织/编钩（crochet）用的**圈数计数器**。钩一行记一圈，不用再靠记忆或者掰手指头。

项目里一共保留了三个版本：一个**双击就能打开的单文件网页**、一个**拆分成 HTML / CSS / JS 并带 TypeScript 源码的工程版**，以及一个**终端里的 Python 版**。三者功能一致，数据都保存在本地，不联网、不上传、无后端。

---

## 功能一览

| 功能 | 说明 |
| --- | --- |
| 计数 +1 | 每钩完一圈点一次「+1 圈」，数字加一 |
| 重置 | 一键归零，重新开始计 |
| 自动保存 | 数字写入浏览器 `localStorage`（网页版）或 `quanshu.txt`（Python 版） |
| 开机恢复 | 关掉页面/程序再打开，接着上次的数字继续 |
| 大号数字显示 | 120px 等宽大数字，隔着桌子也能看清 |
| 深色配色 | GitHub 深色系，夜里钩东西不刺眼 |

---

## 快速开始

### 方式一：单文件网页（最省事）

直接双击 `钩织计数器.html`，用任意现代浏览器打开即可。样式和脚本都内联在这一个文件里，拷走一个文件就能用。

### 方式二：工程版网页（推荐用于继续开发）

双击 `index.html` 即可运行，它通过外链加载 `style.css` 和 `main.js`。

若浏览器对 `file://` 下的模块行为有意见，可以在本目录起一个静态服务器：

```bash
# 任意一种都行
python -m http.server 8000
npx serve .
```

然后访问 <http://localhost:8000>。

### 方式三：Python 终端版

```bash
python 钩织计数器.py
```

交互提示符 `这圈钩完了吗？(y/n/q/r):` 支持四个指令：

| 输入 | 行为 |
| --- | --- |
| `y` | 记一圈，打印「当前第 N 圈」 |
| `n` | 不记圈，回一句「请继续,别停!」 |
| `r` | 重置为 0 |
| `q` | 退出程序 |

计数会写到同目录的 `quanshu.txt` 里，下次启动自动读回。

---

## 目录结构

```
钩织程序/
├── index.html          # 工程版入口（外链 css / js）
├── style.css           # 工程版样式：深色主题、大字号、圆角按钮
├── main.js             # 编译产物：由 main.ts 编译而来（ES2022 class fields）
├── main.ts             # TypeScript 源码，真正的实现
├── 钩织计数器.html      # 单文件版：HTML + CSS + JS 全内联，零依赖
├── 钩织计数器.py        # 终端版：带文件持久化的命令行计数器
├── .gitignore          # 忽略 node_modules/ 与 *.log
└── README.md           # 本文件
```

> 运行产物 `quanshu.txt`（Python 版）会在首次按 `y` 后自动生成，目前没有加入 `.gitignore`，见「已知问题」。

---

## 三个版本的关系

| | 单文件版 | 工程版 | Python 版 |
| --- | --- | --- | --- |
| 入口 | `钩织计数器.html` | `index.html` + `main.js` | `钩织计数器.py` |
| 运行环境 | 浏览器 | 浏览器 | 终端 / Python 3 |
| 持久化 | `localStorage["n"]` | `localStorage["n"]` | `quanshu.txt` |
| 代码组织 | 全局函数 + 内联 `onclick` | `class Counter` + 事件监听 | `class Counter` + `while` 循环 |
| 适合 | 随手用、发给别人 | 继续迭代、加功能 | 不想开浏览器时 |

工程版和单文件版共用同一个 `localStorage` 键 `n`，因此在同一域名（`file://` 或 localhost）下两者数据是互通的；Python 版则完全独立，存自己的 txt 文件。

---

## 代码解析

### 工程版：`main.ts` → `main.js`

核心是一个 `Counter` 类，职责单一——只管数字和存取，不碰 DOM：

```ts
class Counter {
  private n: number;
  constructor() { this.n = Number(localStorage.getItem("n") ?? 0); }
  get value(): number { return this.n; }
  add(): number { this.n += 1; this.save(); return this.n; }
  reset(): void { this.n = 0; this.save(); }
  private save(): void { localStorage.setItem("n", String(this.n)); }
}
```

渲染与交互在类外面：

- `render()` 把 `counter.value` 写进 `#num` 的 `textContent`；
- 两个按钮各挂一个 `click` 监听，**先改状态、再重渲染**，不直接操作数字文本，避免状态和视图两头跑；
- 末尾调用一次 `render()`，保证刷新页面后显示的是持久化下来的值。

`main.js` 是 `main.ts` 的编译结果，特征是保留了 ES2022 的 `class field` 语法（`n;` 单独一行）。**要改逻辑请改 `main.ts` 再编译，别直接手改 `main.js`**，否则下次编译会被覆盖。

重新编译：

```bash
tsc main.ts --target es2022 --module es2022
# 或者在本目录存在 tsconfig.json 时直接：
tsc
```

编译要求 target 至少为 `ES2022`（或用 `useDefineForClassFields`），否则 class field 会被降级成不同的语义。

### 单文件版：`钩织计数器.html`

同样的功能，用最朴素的方式实现：全局变量 `n`、`render()` / `add()` / `reset()` 三个函数，按钮内联 `onclick="add()"`。样式全部塞在 `<style>` 里。

这一版刻意不做类封装，好处是**一个文件、零依赖、双击就开**，适合发给不会装环境的人。

### Python 版：`钩织计数器.py`

```python
def load(self):
    try:
        return int(open("quanshu.txt").read())
    except FileNotFoundError:
        return 0
```

- 启动时尝试读 `quanshu.txt`，文件不存在则从 0 开始；
- 每次 `add()` / `reset()` 都立即落盘，异常退出也不丢数；
- 主循环用 `while True` + 字符串比较分发指令，简单直接。

---

## 界面与样式

`style.css` 的关键几处：

| 选择器 / 属性 | 作用 |
| --- | --- |
| `body` 的 `flex` 居中 | 数字和按钮整体居中，`height: 100vh` 铺满视口 |
| `.num` | `font-size: 120px`、`#7aa2f7` 蓝紫数字、`line-height: 1` 收紧行高 |
| `.btns` | `display: flex; gap: 12px`，两按钮横排等距 |
| `button` | `#1a2332` 底、`#30475e` 描边、`border-radius: 14px`、`padding: 14px 28px` |
| `button:hover` | 描边亮成 `#7aa2f7`，底色微变，`transition: 0.2s` 过渡 |

单文件版用的是同一套配色的紧凑写法（数字 96px、按钮圆角 12px），视觉上基本一致。

---

## 开发与迭代

1. 改 `main.ts`；
2. `tsc` 重新生成 `main.js`；
3. 刷新 `index.html` 验证；
4. 如果改动涉及样式或交互，同步更新 `钩织计数器.html`（单文件版是手工维护的副本，不会自动同步）。

目前没有构建脚本、没有测试、没有依赖，`.gitignore` 只排除了 `node_modules/` 和日志。

---

## 常见问题

**Q：刷新后数字变回 0 了？**
先确认不是隐私模式/无痕窗口（部分浏览器在无痕下会清 `localStorage`）。另外「单文件版」和「工程版」只有在同一打开方式（都是 `file://` 或都是 `http://localhost:端口`）下才共享数据，`file://` 和 `http://` 属于不同源。

**Q：Python 版怎么清空数据？**
按 `r` 重置，或直接删掉 `quanshu.txt`。

**Q：`quanshu.txt` 是空的/乱码？**
文件只存一个整数。如果被手工编辑成非数字，`int()` 会抛 `ValueError` 导致启动失败——见下方「已知问题」。

**Q：为什么还有一个 `新建的VS\钩织程序`？**
桌面上那份是本目录的完整副本（逐文件校验 MD5 一致），属于重复备份，不是另一个项目。后续维护只认本目录。

---

## 已知问题与改进方向

按优先级排列，供后续迭代参考：

1. ~~**`quanshu.txt` 未加入 `.gitignore`**~~ —— 已修复：`.gitignore` 已加入 `quanshu.txt`（运行时数据不入库）。
2. **Python 版错误处理过窄** —— `load()` 只捕获 `FileNotFoundError`；文件损坏或内容非数字时 `int()` 抛 `ValueError`，程序直接崩。建议兜底为 0 或给出提示。
3. **Python 版 `open()` 未指定编码** —— Windows 默认编码下虽存的是纯数字不受影响，仍建议显式 `encoding="utf-8"`；写文件同理，并建议用 `with` 语句（`load` 里目前是裸 `open`，靠 GC 关闭）。
4. **Python 版无「减一」与无效输入提示** —— 输错字符时静默忽略，容易误以为程序卡住；钩错了想退一圈也做不到。
5. **单文件版与工程版重复实现** —— 两处维护容易不同步。可考虑用一个极简构建把 `main.ts` + `style.css` 内联生成单文件版。
6. **缺少「减一圈」「多计数器」** —— 实际钩织常见需求：退圈、同时记多个部件（袖子/衣身）。可以把 `n` 扩展成 `{name: count}` 结构。
7. **无快捷键** —— 移动端/桌面端都适合加上空格键 +1（键盘）和大按钮（触屏）。
8. **无历史记录** —— 只有当前值，没有「第几圈在几点完成的」流水，做复盘或计算用线量时用不上。

---

## 版本记录

| 时间（2026-11-27） | 文件 | 说明 |
| --- | --- | --- |
| 20:13 | `钩织计数器.py` | 最早的原型，终端版 |
| 20:16 | `钩织计数器.html` | 迁移到浏览器，单文件 |
| 20:52 | `main.ts` | 重写为 TypeScript 工程结构 |
| 20:57 | `index.html` | 工程版入口 |
| 20:59 | `style.css` | 样式拆分、深色主题定稿 |
| 21:11 | `main.js` | 由 `main.ts` 编译产出 |
| 21:18 | `.gitignore` | 初始化版本控制前的忽略规则 |

---

## 许可证

本项目采用 [MIT License](LICENSE) 开源。

Copyright (c) 2026 NamesBlues

即：可以自由使用、修改、分发乃至商用，唯一要求是保留版权声明与许可声明，且作者不承担任何担保责任。

---

## 相关链接

- 仓库地址：<https://github.com/NamesBlues/Crochet-Counter>
