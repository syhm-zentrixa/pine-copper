# Pine Copper

Giao diện web để duyệt danh sách phim, tìm kiếm và xem phim từ Pine.

## Chạy và build

Cần Node.js `>=22.12.0`.

```sh
npm ci
npm run dev:ui
npm run build
```

Khi phát hành, đặt `VITE_API_BASE_URL` thành origin HTTPS của dịch vụ API Pine trước khi build. Nếu để trống, giao diện gọi `/api/` trên cùng origin. Frontend không chứa thông tin phiên guest; mọi request Pine và phát video cần backend tương thích.

```sh
VITE_API_BASE_URL=https://api.example.com npm run build
```

## Tính năng

- Danh sách phim với nút tải thêm
- Tìm kiếm phim
- Chọn tập và phát video được backend cấp quyền

Repo này chỉ phát hành frontend. Backend, cấu hình guest và dữ liệu phiên không nằm trong repo hay Release.
