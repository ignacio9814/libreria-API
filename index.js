import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Función para leer datos del archivo db.json
const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return null;
    }
};

// Endpoint para obtener todos los libros
app.get("/books", (req, res) => {
    const data = readData();
    res.json(data.books);
});

// Endpoint para obtener un libro por su ID
app.get("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send("Book not found");
    }
});

// Endpoint para agregar un nuevo libro
app.post("/books", (req, res) => {
    const data = readData();
    const body = req.body;
    const newBook = {
        id: data.books.length + 1,
        ...body,
    };
    data.books.push(newBook);
    writeData(data);
    res.json(newBook);
});

// Función para escribir datos en el archivo db.json
const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

// Endpoint para actualizar un libro por su ID
app.put("/books/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
        data.books[bookIndex] = {
            ...data.books[bookIndex],
            ...body,
        };
        writeData(data);
        res.json({ message: "Book updated successfully" });
    } else {
        res.status(404).send("Book not found");
    }
});

// Endpoint para eliminar un libro por su ID
app.delete("/books/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const bookIndex = data.books.findIndex((book) => book.id === id);
    if (bookIndex !== -1) {
        data.books.splice(bookIndex, 1);
        writeData(data);
        res.json({ message: "Book deleted successfully" });
    } else {
        res.status(404).send("Book not found");
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});

