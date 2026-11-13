const express = require("express");

const cors = require("cors");

const app = express();

const db = require("./database");


app.use(cors());

app.use(express.json());

app.get("/",(req, res) =>{
    res.send("bienvenido a MiniStock");
});

app.get("/productos", (req, res) =>{
    const productos = db.prepare("SELECT * FROM productos").all();

    res.json(productos);
});

app.post("/productos", (req, res) => {

    const {nombre, categoria, marca, precio_compra, precio_venta, cantidad, stock_minimo } =req.body;

const consulta = db.prepare(`
        INSERT INTO productos (
            nombre,
            categoria,
            marca,
            precio_compra,
            precio_venta,
            cantidad,
            stock_minimo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const resultado = consulta.run( nombre,
        categoria,
        marca,
        precio_compra,
        precio_venta,
        cantidad,
        stock_minimo);


        res.status(201).json({
            mensaje: "producto registrado correctamente",
            
            id: resultado.lastInsertRowid
        });
});

app.put("/productos/:id", (req,res) =>{

    const id = Number(req.params.id);

    const {
        nombre,
        categoria,
        marca,
        precio_compra,
        precio_venta,
        cantidad,
        stock_minimo
    } = req.body;
    const consulta = db.prepare(
      `
    UPDATE productos
    SET nombre = ?,
        categoria = ?,
        marca = ?,
        precio_compra = ?,
        precio_venta = ?,
        cantidad = ?,
        stock_minimo = ?
    WHERE id = ?
` 
    );

    const resultado = consulta.run(
        nombre,
        categoria,
        marca,
        precio_compra,
        precio_venta,
        cantidad,
        stock_minimo,
        id
    );

    if(resultado.changes === 0){
        
        return res.status(404).json({
            mensaje: "producto no encontrado"
        });
    }
    res.status(200).json({
        mensaje:"producto actualizado correctamente",
        id: resultado.changes
    });

    
}) 

app.delete("/productos/:id", (req,res) =>{

    const id = Number(req.params.id);

    const consulta = db.prepare("DELETE FROM productos WHERE id = ?");

    const resultado = consulta.run(id);

    if (resultado.changes === 0){
        return res.status(404).json({
            mensaje: "producto no encontrado"
        });
    }

    res.json({
        mensaje: "productos eliminado correctamente"
    });
});

const PUERTO = 3000;

app.listen(PUERTO, () =>{
    console.log(`Servidor funcionando en http://localhost:${PUERTO}`);
});