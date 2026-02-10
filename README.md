# 爱情时光手册（Love Time）

本项目是一个本地离线运行的私人记忆管理工具：支持多模态导入、智能分析、时间线与标签管理、自然语言检索，并强调隐私与加密存储。

## 目录

- [frontend](file:///d:/myWork/python-workspace/love-time/frontend)：React + TypeScript（Vite）
- [backend](file:///d:/myWork/python-workspace/love-time/backend)：FastAPI + Python
- [产品文档](file:///d:/myWork/python-workspace/love-time/%E6%96%B0%E5%BB%BA%20%E6%96%87%E6%9C%AC%E6%96%87%E6%A1%A3.md)

## 本地运行（开发）

### 后端

1. 安装依赖

   - Windows PowerShell：
     - `python -m venv .venv`
     - `./.venv/Scripts/python -m pip install -r backend/requirements.txt`
     - `./.venv/Scripts/python -m pip install -r backend/requirements-dev.txt`

2. 配置环境变量

   - 复制 `backend/.env.example` 为 `backend/.env`

3. 启动

   - `./.venv/Scripts/python -m uvicorn app.main:app --reload --app-dir backend`

### 前端

1. 安装依赖：在 `frontend/` 下执行 `npm install`
2. 启动：`npm run dev`
