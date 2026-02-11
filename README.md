# 爱情时光手册 (Love Time)

本项目是一个本地离线运行的私人记忆管理工具：支持多模态导入、智能分析、时间线与标签管理、自然语言检索，并强调隐私与加密存储。

## 目录

- [frontend](./frontend)：React + TypeScript (Vite)
- [backend](./backend)：FastAPI + Python
- [产品文档](./新建%20文本文档.md)

## 🚀 快速开始 (macOS/Linux)

如果你已经配置好了环境，可以直接使用以下命令一键启动：

```bash
./start.sh
```

该脚本会自动启动后端 API (localhost:8000) 和前端页面 (localhost:5173)。

---

## 🛠️ 环境准备

在运行本项目之前，请确保你的环境满足以下要求：

1.  **Python** 3.10+
2.  **Node.js** 18+ (推荐使用 npm 或 pnpm)
3.  **Ollama** (用于本地 AI 模型支持)
    - 安装 Ollama: [ollama.com](https://ollama.com)
    - 拉取必要模型：
      ```bash
      ollama pull llama3
      ollama pull nomic-embed-text
      ```

## 📦 安装与配置

### 1. 后端设置

```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境 (macOS/Linux)
source .venv/bin/activate
# Windows PowerShell: .\.venv\Scripts\Activate.ps1

# 安装依赖
pip install -r backend/requirements.txt

# 配置环境变量
cp backend/.env.example backend/.env
# 注意：根据需要修改 backend/.env 中的配置，例如数据库路径或 Ollama 地址
```

### 2. 前端设置

```bash
cd frontend
npm install
```

## ▶️ 手动启动

如果不想使用一键脚本，可以分别启动服务：

### 启动后端

```bash
# 在项目根目录下
source .venv/bin/activate
python -m uvicorn app.main:app --reload --app-dir backend
```
后端服务默认运行在: http://localhost:8000

### 启动前端

```bash
cd frontend
npm run dev
```
前端页面默认运行在: http://localhost:5173
