import express from "express";
import InMemoryTodoRepository from "./adapter/repositories/inmemory.js";
import SQLiteTodoRepository from "./adapter/repositories/sqlite.js";
import TodoService from "./core/service.js";
import handler from "./handler/handler.js";
import middleware from "./handler/middleware.js";

// Membuat aplikasi express.
const app = express();

// Menentukan port yang akan dipakai oleh aplikasi express untuk menerima request.
// Pastikan port ini sedang tidak terpakai oleh aplikasi lain.
const port = 3000;

// Untuk bisa baca json payload.
app.use(express.json());

// Membuat repository todo.
// const repository = new InMemoryTodoRepository();
const repository = new SQLiteTodoRepository();

// Membuat service todo.
const service = new TodoService(repository);

// Masukkan service kedalam aplikasi express supaya bisa di akses dari route handler.
app.set("service", service);

// Daftarkan endpoint untuk menambahkan todo baru.
app.post("/todos", handler.create);

// Daftarkan endpoint untuk menampilkan todos yang telah dibuat.
app.get("/todos", handler.list);

// Daftarkan endpoint untuk menandai todo sebagai selesai atau belum selesai.
app.post("/todos/:id/toggle", handler.toggle);

// Daftarkan endpoint untuk menghapus todo.
app.delete("/todos/:id", handler.remove);

// Daftarkan endpoint untuk mengubah todo.
app.put("/todos/:id", handler.update);

// Pakai middleware untuk handle ketika error terjadi. Ini berguna untuk
// memutuskan tipe error apa yang akan dikembalikan ke API client.
app.use(middleware.errorHandler);

// Mulai menerima request di port yang kita tentukan diatas,
// kemudian menampilkan pesan di console ketika semuanya sudah siap.
app.listen(port, () => {
  console.log(`api siap menerima request di port ${port}`);
});
