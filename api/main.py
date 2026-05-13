from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from route.auth_route import router as auth_router
from route.admin_route import router as admin_router
from route.media_route import router as media_router
from app.settings.cors import setup_cors

app = FastAPI(title="BotAPI")

setup_cors(app)

app.mount("/uploads", StaticFiles(directory="storage/uploads"), name="uploads")

app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(media_router)


@app.get("/")
async def root():
    return {"message": "API Running"}
