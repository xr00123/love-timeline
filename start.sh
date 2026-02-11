#!/bin/bash

# 脚本说明：一键启动前后端服务
# 使用方式：在项目根目录下执行 ./start.sh

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}>>> 正在启动 爱情时光手册 (Love Time)...${NC}"

# 检查 .venv 是否存在
if [ ! -d ".venv" ]; then
    echo -e "${RED}错误：未找到 Python 虚拟环境 (.venv)${NC}"
    echo "请先执行以下命令进行初始化："
    echo "python -m venv .venv"
    echo "source .venv/bin/activate"
    echo "pip install -r backend/requirements.txt"
    exit 1
fi

# 检查 frontend/node_modules 是否存在
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${RED}错误：未找到前端依赖${NC}"
    echo "请先进入 frontend 目录执行 npm install"
    exit 1
fi

# 捕获退出信号，确保同时关闭前后端
trap 'kill 0' EXIT

# 启动后端
echo -e "${GREEN}>>> 正在启动后端服务 (FastAPI)...${NC}"
.venv/bin/python -m uvicorn app.main:app --reload --app-dir backend &

# 等待几秒确保后端开始启动
sleep 2

# 启动前端
echo -e "${GREEN}>>> 正在启动前端服务 (Vite)...${NC}"
cd frontend
npm run dev &

# 等待所有后台任务
wait
