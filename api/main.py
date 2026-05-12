from fastapi import FastAPI

from route.auth_route import router as auth_router
from route.admin_route import router as admin_router
from app.settings.cors import setup_cors

app = FastAPI(title="BotAPI")

setup_cors(app)

app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/")
async def root():
    return {"message": "BotAPI Running"}