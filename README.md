# RETRACTA

## Sistema Inteligente de Automação Residencial

O RETRACTA é um sistema IoT que automatiza um varal retrátil, utilizando sensores e um aplicativo para monitorar as condições climáticas e controlar o varal.

## Tecnologias

- React Native + Expo
- TypeScript
- Python + FastAPI
- SQLAlchemy
- SQLite
- ESP32 (integração futura)

---

# Como executar o projeto

## 1. Pré-requisitos

**Instale no computador:**

- Node.js (winget install OpenJS.NodeJS)

- Python (winget install Python.Python.3.14)

- Git (winget install --id Git.Git -e --source winget)

- fastapi (pip install fastapi uvicorn)

- SqLAlchemy(pip install sqlalchemy)

**Verifique:**

node --version

npm --version

python --version

git --version

---

cd C:\Users\Dell\Documents\RETRACTA\app

npx expo start

Terminal 1 — backend:

cd C:\Users\Dell\Documents\RETRACTA\backend

pip install fastapi uvicorn

pip install "fastapi[standard]"

fastapi dev main.py 

Terminal 2 — app:

cd C:\Users\Dell\Documents\RETRACTA\app

npx expo start -c

