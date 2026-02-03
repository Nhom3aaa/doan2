@echo off
echo ===================================================
echo   CAI DAT VA KHOI DONG PHONE STORE (TU DONG)
echo ===================================================

echo [1/3] Dang khoi tao moi truong...
if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo     - Da tao file backend/.env
) else (
    echo     - File backend/.env da ton tai
)

echo.
echo [2/3] Dang khoi dong Docker (Web + Server + DB)...
docker-compose up -d --build

echo.

echo.
echo [3/3] Dang nap du lieu...
echo     - Ban co muon nap du lieu mau (Se XOA het du lieu cu)? (Y/N)
set /p user_choice="Nhap lua chon (Mac dinh la N): "

if /i "%user_choice%"=="Y" (
    echo     - Vui long cho server khoi dong...
    timeout /t 15 /nobreak >nul
    docker-compose exec -T backend npm run seed
) else (
    echo     - Da BO QUA buoc nap du lieu mau.
    echo     - Giu nguyen du lieu hien tai cua ban.
)

echo.
echo ===================================================
echo   XONG! HE THONG DA SAN SANG.
echo ===================================================
echo.
echo   - Trang web: http://localhost
echo   - Admin API: http://localhost:5001/api/products
echo.
pause
