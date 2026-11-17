let idProductoEditando = null;

const formulario = document.getElementById("formulario-producto");

// Escuchar cuando el usuario envía el formulario
formulario.addEventListener("submit", async (evento) => {

    // Evitar que la página se recargue
    evento.preventDefault();

    // Obtener los valores de los campos
    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const marca = document.getElementById("marca").value;
    const precioCompra = document.getElementById("precio-compra").value;
    const precioVenta = document.getElementById("precio-venta").value;
    const cantidad = document.getElementById("cantidad").value;
    const stockMinimo = document.getElementById("stock-minimo").value;

    // Crear el objeto con los datos del producto
    const producto = {
        nombre: nombre,
        categoria: categoria,
        marca: marca,
        precio_compra: Number(precioCompra),
        precio_venta: Number(precioVenta),
        cantidad: Number(cantidad),
        stock_minimo: Number(stockMinimo)
    };

    let metodo;

    if(idProductoEditando === null){
        metodo = "POST";
    }
    else{
        metodo = "PUT"
    }
    let url;

    if(idProductoEditando === null){
        url ="http://localhost:3000/productos";
    }else{
        url =  `http://localhost:3000/productos/${idProductoEditando}`;

    }

    // Enviar el producto al backend mediante POST
    const respuesta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
    });

    // Convertir la respuesta del servidor a JSON
    const resultado = await respuesta.json();

    // Mostrar información de la respuesta
    console.log("estado:", respuesta.status);
    console.log("respuesta del servidor:", resultado);

    // Actualizar la tabla después de registrar el producto
    await cargarProductos();
});


// Seleccionar el cuerpo de la tabla HTML
const tablaProductos = document.getElementById("tabla-productos");

let productosRegistrados= [];

const buscadorProductos = document.getElementById("buscar-producto");

buscadorProductos.addEventListener("input", function(){

    const textoBuscado = buscadorProductos.value.trim().toLowerCase();

    const filas =  tablaProductos.getElementsByTagName("tr");

    for(let i =0; i < filas.length; i++){

        const nombre  = filas[i].cells[1].textContent.toLowerCase();

        const categoria = filas[i].cells[2].textContent.toLowerCase();

        const marca = filas[i].cells[3].textContent.toLowerCase();

        if(nombre.includes(textoBuscado)  || 
    categoria.includes(textoBuscado) ||
    marca.includes(textoBuscado))
    { 
        filas[i].style.display = "";
    }else{
           filas[i].style.display = "none";
    }
}
});

// Crear función para consultar los productos
async function cargarProductos() {

    try {

        // Solicitar los productos al backend mediante GET
        const respuesta = await fetch("http://localhost:3000/productos");

        // Comprobar si la petición fue exitosa
        if (!respuesta.ok) {
            throw new Error("Error al obtener los productos");
        }

        // Convertir la respuesta JSON en un arreglo
        const productos = await respuesta.json();

        productosRegistrados = productos;

        // Limpiar la tabla antes de mostrar los productos
        tablaProductos.innerHTML = "";

        // Recorrer todos los productos recibidos
        for (let i = 0; i < productos.length; i++) {

            // Obtener el producto actual
            const producto = productos[i];

            // Crear una fila nueva
            const fila = document.createElement("tr");

            // Organizar los datos del producto en un arreglo
            const valores = [
                producto.id,
                producto.nombre,
                producto.categoria,
                producto.marca,
                producto.precio_compra,
                producto.precio_venta,
                producto.cantidad,
                producto.stock_minimo
            ];

            // Crear una celda por cada dato
            for (let j = 0; j < valores.length; j++) {

                // Crear una celda HTML
                const celda = document.createElement("td");

                // Insertar el dato correspondiente
                celda.textContent = valores[j];

                // Agregar la celda a la fila
                fila.appendChild(celda);
            }

                const botonEliminar = document.createElement("button");

                botonEliminar.type = "button";

                botonEliminar.textContent = "Eliminar";

                botonEliminar.addEventListener("click", () => {

                    eliminarProducto(producto.id);

                       });

                const botonEditar = document.createElement("button");

                botonEditar.type = "button";

                botonEditar.textContent ="editar";

                botonEditar.addEventListener("click", () =>{
                    
                prepararEdicion(producto)
                });
                



                const celdaAcciones = document.createElement("td");

                celdaAcciones.appendChild(botonEliminar);

                celdaAcciones.appendChild(botonEditar);

                fila.appendChild(celdaAcciones);
            

            // Agregar la fila completa a la tabla
            tablaProductos.appendChild(fila);
            }

    } catch (error) {

        // Mostrar cualquier error que ocurra
        console.error("error:", error.message);
    }
}
cargarProductos();

// Cocarnsultar los productos cuando se carga la página


async function eliminarProducto(id) {

    try {
        
        const respuesta = await fetch(`http://localhost:3000/productos/${id}`, {
            method: "DELETE"
        });

        if(!respuesta.ok) {
            throw new Error("No se pudo eliminar el producto");
        }

        const resultado = await respuesta.json(); 
      
        console.log(resultado.mensaje);

        await cargarProductos();     

 } catch (error) {

    console.error("Error:", error.message);
 }
}

// Preparar el formulario para editar un producto
function prepararEdicion(producto) {

    // Guardar el ID del producto seleccionado
    idProductoEditando = producto.id;

    // Obtener los elementos del formulario
    const nombre = document.getElementById("nombre");
    const categoria = document.getElementById("categoria");
    const marca = document.getElementById("marca");
    const precio_compra = document.getElementById("precio-compra");
    const precio_venta = document.getElementById("precio-venta");
    const cantidad = document.getElementById("cantidad");
    const stock_minimo = document.getElementById("stock-minimo");

    // Colocar los datos del producto en los campos
    nombre.value = producto.nombre;
    categoria.value = producto.categoria;
    marca.value = producto.marca;
    precio_compra.value = producto.precio_compra;
    precio_venta.value = producto.precio_venta;
    cantidad.value = producto.cantidad;
    stock_minimo.value = producto.stock_minimo;
}
