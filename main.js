const $nombreProducto = document.querySelector('#nombreProducto')
const $precioProducto = document.querySelector('#precioProducto')
const $stockProducto = document.querySelector('#stockProducto')
const $botonAgregar = document.querySelector('#agregarProducto')
const $contenedorStock = document.querySelector('.stock')
const $modal = document.getElementById('ventanaModal');
const $closeModal = document.getElementById('cerrarModal');
const $buscadorInput = document.querySelector('#buscador')



const Compras = function compras(nombre, precio, stock) {
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
}
let producto1 = new Compras('guitarra', 200000, 14)
let producto2 = new Compras('piano', 183000, 2)
let producto3 = new Compras('violin', 59000, 4)
let producto4 = new Compras('bateria', 262000, 8)
let producto5 = new Compras('flauta', 9000, 10)
let producto6 = new Compras('tambor', 8000, 9)

let lista = [producto1, producto2, producto3, producto4, producto5, producto6]

function card() {
    $contenedorStock.innerHTML = "";

    if (lista.length === 0) {
        const noCoincidencias = document.createElement('h2');
        noCoincidencias.classList.add('noSeEncontro');
        noCoincidencias.textContent = 'No hay productos para mostrar!';
        $contenedorStock.appendChild(noCoincidencias);
        return;
    }

    lista.forEach((producto, index) => {
        let cardProducto = document.createElement('DIV');
        cardProducto.classList.add('contenedorStock');
        cardProducto.innerHTML = `
        <div class="titulo">
            <h2 class="tituloProductos">Producto en Stock</h2>
        </div>
        <p class="nombreProductoStock">NOMBRE DEL PRODUCTO: <span class="span">${producto.nombre.toUpperCase()}</span></p>
        <p class="precioProductoStock">PRECIO DEL PRODUCTO:  <span class="span">$${producto.precio}</span></p>
        <p class="stockDisponible">STOCK DEL PRODUCTO: <span class="span">${producto.stock}</span></p>
        <button class="borrarCard" data-index="${index}">Eliminar producto</button>`;
        $contenedorStock.appendChild(cardProducto);
    });

    const botonesEliminar = document.querySelectorAll('.borrarCard');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            eliminarProducto(index);
        });
    });
}

function eliminarProducto(index) {
    lista.splice(index, 1);
    guardarEnLocalStorage();
    card();
}
card()

productoAgregado()
function productoAgregado() {


    datosProductos()

    let nombreProducto = "";
    let precioProducto = "";
    let stockProducto = "";


    function datosProductos() {
        $nombreProducto.addEventListener('keyup', (e) => {
            nombreProducto = e.target.value;
        });

        $precioProducto.addEventListener('keyup', (e) => {
            precioProducto = e.target.value;
        });

        $stockProducto.addEventListener('keyup', (e) => {
            stockProducto = e.target.value;
        });
    }

    $botonAgregar.addEventListener('click', () => {
        const nombreProducto = $nombreProducto.value.trim();
        const precioProducto = $precioProducto.value.trim();
        const stockProducto = $stockProducto.value.trim();

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });

        if (nombreProducto === "" || precioProducto === "" || stockProducto === "") {
            Toast.fire({
                icon: 'warning',
                title: 'Todos los campos son obligatorios',
            });
            return;
        }

        if (isNaN(parseFloat(precioProducto)) || isNaN(parseInt(stockProducto))) {
            Toast.fire({
                icon: 'error',
                title: 'Los datos son inválidos. El precio y el stock deben ser números válidos.',
            });
            return;
        }

        const productoExistente = lista.find(producto => producto.nombre.toLowerCase() === nombreProducto.toLowerCase());

        if (productoExistente) {
            Toast.fire({
                icon: 'error',
                title: `ya contamos con stock de "${nombreProducto}"`,
            });
            return;
        }

        const producto = new Compras(nombreProducto, parseFloat(precioProducto), parseInt(stockProducto));
        lista.unshift(producto);
        guardarEnLocalStorage();
        card();
        $nombreProducto.value = '';
        $precioProducto.value = '';
        $stockProducto.value = '';
        $modal.style.display = 'none';

        Toast.fire({
            icon: 'success',
            title: '¡Producto agregado a favoritos!',
            text: `"${nombreProducto}" ha sido agregado al Stock.`,
        });
    });

    $closeModal.addEventListener('click', () => {
        $modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === $modal) {
            $modal.style.display = 'none';
        }
    });

}

let inputBuscadorLupa = '';

$buscadorInput.addEventListener('keyup', (e) => {
    inputBuscadorLupa = e.target.value.toLowerCase();
    filtrarProductos(inputBuscadorLupa);
});

function filtrarProductos(filtro) {
    const productosFiltrados = lista.filter(producto => producto.nombre.toLowerCase().includes(filtro));

    $contenedorStock.innerHTML = '';

    if (productosFiltrados.length === 0) {
        const noCoincidencias = document.createElement('h2');
        noCoincidencias.classList.add('noSeEncontro')
        noCoincidencias.textContent = 'No encontramos el producto, agregalo a nuestro stock!';
        $contenedorStock.appendChild(noCoincidencias);
    } else {
        productosFiltrados.forEach(producto => {
            let cardProducto = document.createElement('DIV');
            cardProducto.classList.add('contenedorStock');
            cardProducto.innerHTML = `
            <div class="titulo">
                <h2 class="tituloProductos">Producto en Stock</h2>
            </div>
            <p class="nombreProductoStock">NOMBRE DEL PRODUCTO: <span class="span">${producto.nombre.toUpperCase()}</span></p>
            <p class="precioProductoStock">PRECIO DEL PRODUCTO:  <span class="span">$${producto.precio}</span></p>
            <p class="stockDisponible">STOCK DEL PRODUCTO: <span class="span">${producto.stock}</span></p>`;

            $contenedorStock.appendChild(cardProducto);
        });
    }
}

function guardarEnLocalStorage() {
    const productosJSON = JSON.stringify(lista);
    localStorage.setItem('productos', productosJSON);
}
function cargarDesdeLocalStorage() {
    const productosJSON = localStorage.getItem('productos');

    if (productosJSON) {
        lista = JSON.parse(productosJSON);
        card();
    }
}
window.addEventListener('load', () => {
    cargarDesdeLocalStorage();
});