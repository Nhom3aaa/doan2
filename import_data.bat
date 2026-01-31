@echo off
echo ===================================================
echo   KHOI PHUC DU LIEU DATABASE TU FILE BACKUP
echo ===================================================

echo [1/2] Dang kiem tra file backup...
if not exist "backend\backup_data\products.json" (
    echo [!] Khong tim thay file backup. Vui long chay export_data.bat o may cu truoc.
    pause
    exit
)

echo.
echo [2/2] Dang nap du lieu vao MongoDB...

echo   - Dang nhap Products...
docker-compose exec -T mongo mongoimport --db phone-store --collection products --file /app/backup_data/products.json --jsonArray --drop

echo   - Dang nhap Users...
docker-compose exec -T mongo mongoimport --db phone-store --collection users --file /app/backup_data/users.json --jsonArray --drop

echo   - Dang nhap Orders...
docker-compose exec -T mongo mongoimport --db phone-store --collection orders --file /app/backup_data/orders.json --jsonArray --drop

echo   - Dang nhap Carts...
docker-compose exec -T mongo mongoimport --db phone-store --collection carts --file /app/backup_data/carts.json --jsonArray --drop

echo.
echo ===================================================
echo   DA KHOI PHUC THANH CONG!
echo   Website cua ban gio da giong het may cu.
echo ===================================================
pause
