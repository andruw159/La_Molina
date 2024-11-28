/*!
 * Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
 */
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

// Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };
    // Shrink the navbar 
    navbarShrink();
    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);
    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }
    ;
    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
            document.querySelectorAll('#navbarResponsive .nav-link')
            );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});
//Agregar productos al carrito de compra.
function agregarAlCarrito(nombre, precio) {
    // Cargar el carrito actual desde el localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Buscar si el producto ya está en el carrito
    let productoExistente = carrito.find(producto => producto.nombre === nombre);
    if (productoExistente) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        productoExistente.cantidad += 1;
    } else {
        // Si el producto no está en el carrito, agregarlo
        carrito.push({nombre: nombre, precio: precio, cantidad: 1});
    }

    // Guardar el carrito actualizado en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    alert('Producto agregado al carrito');
}
//CRUDI

const isAdmin = true;
window.onload = function () {
    if (isAdmin) {
        document.getElementById("admin-panel").style.display = "block";
    }
};
// Gestión de productos
let products = [];
// Agregar producto
function addProduct() {
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const stock = parseInt(document.getElementById("product-stock").value);
    if (name && price > 0 && stock >= 0) {
        const product = {name, price, stock};
        products.push(product);
        displayProducts();
        clearForm();
    } else {
        alert("Por favor, complete todos los campos correctamente.");
    }
}

// Mostrar productos
function displayProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";
    products.forEach((product, index) => {
        productList.innerHTML += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                ${product.name} - $${product.price} (Stock: ${product.stock})
                <div>
                    <button class="btn btn-sm btn-warning" onclick="editProduct(${index})">Editar</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${index})">Eliminar</button>
                </div>
            </li>
        `;
    });
}

// Editar producto
function editProduct(index) {
    const product = products[index];
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-stock").value = product.stock;
    // Eliminar el producto temporalmente para actualizar
    deleteProduct(index);
}

// Eliminar producto
function deleteProduct(index) {
    products.splice(index, 1);
    displayProducts();
}

// Limpiar formulario
function clearForm() {
    document.getElementById("admin-form").reset();
}


//Log In-----------

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Credenciales de ejemplo (esto se reemplazará con tu base de datos)
    const validUsername = "admin";
    const validPassword = "12345";
    if (username === validUsername && password === validPassword) {
// Redirigir al panel de administración
        window.location.href = "admin-panel.html";
    } else {
// Mostrar mensaje de error
        document.getElementById('errorMessage').style.display = "block";
    }
});
function fetchProducts() {
    fetch('obtenerProductos')
            .then(response => response.text())
            .then(html => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = html;
            })
            .catch(error => console.error('Error fetching products:', error));
}

function addProduct() {
    const form = document.getElementById('admin-form');
    const formData = new URLSearchParams(new FormData(form)).toString();
    fetch('registroProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then(response => {
        if (response.ok) {
            fetchProducts(); // Reload the list after adding
            form.reset();
        } else {
            console.error('Error adding product:', response.statusText);
        }
    }).catch(error => console.error('Error adding product:', error));
}

function editProduct(idProducto) {
    const form = document.getElementById('admin-form');
    const formData = new URLSearchParams(new FormData(form)).toString() + `&idProducto=${idProducto}`;
    fetch('editarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then(response => {
        if (response.ok) {
            fetchProducts(); // Reload the list after editing
            form.reset();
        } else {
            console.error('Error editing product:', response.statusText);
        }
    }).catch(error => console.error('Error editing product:', error));
}

function deleteProduct(idProducto) {
    const formData = new URLSearchParams({idProducto}).toString();
    fetch('eliminarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then(response => {
        if (response.ok) {
            fetchProducts(); // Reload the list after deleting
        } else {
            console.error('Error deleting product:', response.statusText);
        }
    }).catch(error => console.error('Error deleting product:', error));
}

document.addEventListener('DOMContentLoaded', fetchProducts);
function fetchProducts() {
    fetch('obtenerProductos')
            .then(response => response.text())
            .then(html => {
                const productList = document.getElementById('product-list');
                productList.innerHTML = html;
            })
            .catch(error => console.error('Error fetching products:', error));
}

function addProduct() {
    const form = document.getElementById('admin-form');
    const formData = new URLSearchParams(new FormData(form)).toString();
    const action = form.querySelector('input[name="idProducto"]').value ? 'editarProducto' : 'registroProducto';
    fetch(action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }).then(response => {
        if (response.ok) {
            fetchProducts();
            form.reset();
        } else {
            console.error('Error adding/editing product:', response.statusText);
        }
    }).catch(error => console.error('Error adding/editing product:', error));
}

function editProduct(idProducto) {
    fetch(`obtenerProducto?idProducto=${idProducto}`)
            .then(response => response.text())
            .then(data => {
                const product = data.split('|');
                document.getElementById('product-id').value = product[0];
                document.getElementById('product-name').value = product[1] || '';
                document.getElementById('product-description').value = product[2] || '';
                document.getElementById('product-stock').value = product[3] || '';
                document.getElementById('product-price').value = product[4] || '';
                document.getElementById('product-iva').value = product[5] || '';
                document.getElementById('product-weight').value = product[6] || '';
                document.getElementById('product-category').value = product[7] || '';
            })
            .catch(error => console.error('Error fetching product:', error));
}

function deleteProduct(idProducto) {
    fetch('eliminarProducto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({idProducto}).toString()
    }).then(response => {
        if (response.ok) {
            fetchProducts(); // Reload the list after deletion
        } else {
            console.error('Error deleting product:', response.statusText);
        }
    }).catch(error => console.error('Error deleting product:', error));
}

document.addEventListener('DOMContentLoaded', fetchProducts);


    function fetchUsers() {
        fetch('obtenerUsuarios')
            .then(response => response.text())
            .then(html => {
                const userList = document.getElementById('user-list');
                userList.innerHTML = html;
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    function addUser() {
        const form = document.getElementById('user-form');
        const formData = new URLSearchParams(new FormData(form)).toString();
        const action = form.querySelector('input[name="id"]').value ? 'editarUsuario' : 'registroUsuario';

        fetch(action, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                fetchUsers();
                form.reset();
            } else {
                console.error('Error adding/editing user:', response.statusText);
            }
        }).catch(error => console.error('Error adding/editing user:', error));
    }

    function editUser(id) {
        fetch(`obtenerUsuario?id=${id}`)
            .then(response => response.text())
            .then(data => {
                const user = data.split('|');
                document.getElementById('user-id').value = user[0];
                document.getElementById('user-nombres').value = user[1] || '';
                document.getElementById('user-apellidos').value = user[2] || '';
                document.getElementById('user-fechaNacimiento').value = user[3] || '';
                document.getElementById('user-correo').value = user[4] || '';
                document.getElementById('user-telefono').value = user[5] || '';
                document.getElementById('user-direccion').value = user[6] || '';
                document.getElementById('user-clave').value = user[7] || '';
                document.getElementById('user-rol').value = user[8] || '';
            })
            .catch(error => console.error('Error fetching user:', error));
    }

    function deleteUser(id) {
        fetch('eliminarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ id }).toString()
        }).then(response => {
            if (response.ok) {
                fetchUsers();
            } else {
                console.error('Error deleting user:', response.statusText);
            }
        }).catch(error => console.error('Error deleting user:', error));
    }

    document.addEventListener('DOMContentLoaded', fetchUsers);


//script para el Login


