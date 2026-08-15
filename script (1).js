document.addEventListener("DOMContentLoaded", () => {
    // Autenticación
    const authSection = document.getElementById("auth-section");
    const appSection = document.getElementById("app-section");
    const registerCard = document.getElementById("register-card");
    const loginCard = document.getElementById("login-card");
    const linkToLogin = document.getElementById("link-to-login");
    const linkToRegister = document.getElementById("link-to-register");

    const formRegister = document.getElementById("form-register");
    const formLogin = document.getElementById("form-login");
    const btnLogout = document.getElementById("btn-logout");
    const userDisplayName = document.getElementById("user-display-name");

    // Navegación Pestañas
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    // CRUD Ventas
    const formVenta = document.getElementById("form-venta");
    const ventaIdInput = document.getElementById("venta-id");
    const clienteInput = document.getElementById("cliente");
    const productoInput = document.getElementById("producto");
    const cantidadInput = document.getElementById("cantidad");
    const precioInput = document.getElementById("precio");
    const tablaVentasBody = document.getElementById("tabla-ventas-body");
    const formTitle = document.getElementById("form-title");
    const btnCancelar = document.getElementById("btn-cancelar");

    // Stats
    const statTotalVentas = document.getElementById("stat-total-ventas");
    const statMontoTotal = document.getElementById("stat-monto-total");
    const statTotalCatalogo = document.getElementById("stat-total-catalogo");
    const catalogCountBadge = document.getElementById("catalog-count");

    // CATÁLOGO AMPLIADO CON MÁS PRODUCTOS E IMÁGENES
    const productosCatalogo = [
        { id: "1", categoria: "Laptops", nombre: "Laptop HP ProBook 15.6''", precio: 750.00, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&auto=format&fit=crop&q=60" },
        { id: "2", categoria: "Monitores", nombre: "Monitor Gamer LG 27'' IPS", precio: 245.00, img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60" },
        { id: "3", categoria: "Periféricos", nombre: "Teclado Mecánico RGB Red Switch", precio: 65.00, img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60" },
        { id: "4", categoria: "Periféricos", nombre: "Mouse Ergonómico Inalámbrico", precio: 35.00, img: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60" },
        { id: "5", categoria: "Audio", nombre: "Audífonos Bluetooth Cancelación Ruido", precio: 89.99, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" },
        { id: "6", categoria: "Smartphones", nombre: "Smartphone 5G 128GB Pro", precio: 499.00, img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60" },
        { id: "7", categoria: "Accesorios", nombre: "Silla Gamer Ergonómica Premium", precio: 185.00, img: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=500&auto=format&fit=crop&q=60" },
        { id: "8", categoria: "Redes", nombre: "Camara Web Full HD 1080p Autofocus", precio: 45.50, img: "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=500&auto=format&fit=crop&q=60" }
    ];

    // NAVEGACIÓN PESTAÑAS
    navButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            navButtons.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.add("hidden"));

            btn.classList.add("active");
            const target = btn.getAttribute("data-target");
            document.getElementById(target).classList.remove("hidden");
        });
    });

    // VISTAS DE AUTENTICACIÓN
    linkToLogin.addEventListener("click", () => {
        registerCard.classList.add("hidden");
        loginCard.classList.remove("hidden");
    });

    linkToRegister.addEventListener("click", () => {
        loginCard.classList.add("hidden");
        registerCard.classList.remove("hidden");
    });

    function getRegisteredUsers() {
        return JSON.parse(localStorage.getItem("db_usuarios")) || [];
    }

    function getLoggedUser() {
        return JSON.parse(localStorage.getItem("session_usuario"));
    }

    checkSession();

    function checkSession() {
        const user = getLoggedUser();
        if (user) {
            authSection.classList.add("hidden");
            appSection.classList.remove("hidden");
            userDisplayName.textContent = `${user.nombre} ${user.apellido}`;
            cargarVentas();
            cargarCatalogo();
        } else {
            authSection.classList.remove("hidden");
            appSection.classList.add("hidden");
        }
    }

    // Registro
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        const nombre = document.getElementById("reg-nombre").value.trim();
        const apellido = document.getElementById("reg-apellido").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const password = document.getElementById("reg-password").value.trim();

        document.getElementById("error-reg-nombre").textContent = "";
        document.getElementById("error-reg-apellido").textContent = "";
        document.getElementById("error-reg-email").textContent = "";
        document.getElementById("error-reg-password").textContent = "";

        if (!nombre) { document.getElementById("error-reg-nombre").textContent = "Obligatorio."; isValid = false; }
        if (!apellido) { document.getElementById("error-reg-apellido").textContent = "Obligatorio."; isValid = false; }
        if (!email || !email.includes("@")) { document.getElementById("error-reg-email").textContent = "Correo inválido."; isValid = false; }
        if (!password || password.length < 6) { document.getElementById("error-reg-password").textContent = "Min. 6 caracteres."; isValid = false; }

        if (!isValid) return;

        let usuarios = getRegisteredUsers();
        if (usuarios.some(u => u.email === email)) {
            document.getElementById("error-reg-email").textContent = "El correo ya está registrado.";
            return;
        }

        usuarios.push({ nombre, apellido, email, password });
        localStorage.setItem("db_usuarios", JSON.stringify(usuarios));
        localStorage.setItem("session_usuario", JSON.stringify({ nombre, apellido, email }));
        
        formRegister.reset();
        checkSession();
    });

    // Login
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("log-email").value.trim();
        const password = document.getElementById("log-password").value.trim();

        document.getElementById("error-log-email").textContent = "";
        document.getElementById("error-log-password").textContent = "";

        const usuarios = getRegisteredUsers();
        const foundUser = usuarios.find(u => u.email === email && u.password === password);

        if (!foundUser) {
            document.getElementById("error-log-password").textContent = "Credenciales incorrectas.";
            return;
        }

        localStorage.setItem("session_usuario", JSON.stringify({
            nombre: foundUser.nombre,
            apellido: foundUser.apellido,
            email: foundUser.email
        }));

        formLogin.reset();
        checkSession();
    });

    btnLogout.addEventListener("click", () => {
        localStorage.removeItem("session_usuario");
        checkSession();
    });

    // Cargar Catálogo
    function cargarCatalogo() {
        const container = document.getElementById("products-container");
        container.innerHTML = "";

        statTotalCatalogo.textContent = productosCatalogo.length;
        catalogCountBadge.textContent = `${productosCatalogo.length} Productos`;

        productosCatalogo.forEach(p => {
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <div class="product-img-wrapper">
                    <span class="category-tag">${p.categoria}</span>
                    <img src="${p.img}" alt="${p.nombre}">
                </div>
                <div class="product-details">
                    <h4>${p.nombre}</h4>
                    <div class="product-price">$${p.precio.toFixed(2)}</div>
                    <button class="btn btn-gradient-primary" onclick="seleccionarProducto('${p.nombre}', ${p.precio})">
                        <i class="fa-solid fa-cart-plus"></i> Vender Este
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    window.seleccionarProducto = function(nombre, precio) {
        document.querySelector('[data-target="sec-ventas"]').click();
        productoInput.value = nombre;
        precioInput.value = precio;
        cantidadInput.value = 1;
        clienteInput.focus();
    };

    // CRUD Ventas
    function getVentas() {
        return JSON.parse(localStorage.getItem("db_ventas")) || [];
    }

    function guardarVentasEnStorage(ventas) {
        localStorage.setItem("db_ventas", JSON.stringify(ventas));
    }

    formVenta.addEventListener("submit", (e) => {
        e.preventDefault();
        let isValid = true;

        const id = ventaIdInput.value;
        const cliente = clienteInput.value.trim();
        const producto = productoInput.value.trim();
        const cantidad = cantidadInput.value.trim();
        const precio = precioInput.value.trim();

        document.getElementById("error-cliente").textContent = "";
        document.getElementById("error-producto").textContent = "";
        document.getElementById("error-cantidad").textContent = "";
        document.getElementById("error-precio").textContent = "";

        if (!cliente) { document.getElementById("error-cliente").textContent = "Requerido."; isValid = false; }
        if (!producto) { document.getElementById("error-producto").textContent = "Requerido."; isValid = false; }
        if (!cantidad || cantidad <= 0) { document.getElementById("error-cantidad").textContent = "Inválido."; isValid = false; }
        if (!precio || precio <= 0) { document.getElementById("error-precio").textContent = "Inválido."; isValid = false; }

        if (!isValid) return;

        let ventas = getVentas();

        if (id === "") {
            ventas.push({
                id: Date.now().toString(),
                cliente,
                producto,
                cantidad: parseInt(cantidad),
                precio: parseFloat(precio)
            });
        } else {
            ventas = ventas.map(v => v.id === id ? { id, cliente, producto, cantidad: parseInt(cantidad), precio: parseFloat(precio) } : v);
        }

        guardarVentasEnStorage(ventas);
        limpiarFormularioVenta();
        cargarVentas();
    });

    function cargarVentas() {
        const ventas = getVentas();
        tablaVentasBody.innerHTML = "";
        let montoAcumulado = 0;

        if (ventas.length === 0) {
            tablaVentasBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); font-weight: 600; padding: 24px;">No hay registros de ventas.</td></tr>`;
        } else {
            ventas.forEach(v => {
                const total = (v.cantidad * v.precio);
                montoAcumulado += total;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${v.cliente}</strong></td>
                    <td>${v.producto}</td>
                    <td>${v.cantidad}</td>
                    <td><strong style="color: #059669;">$${total.toFixed(2)}</strong></td>
                    <td class="actions-cell">
                        <button class="btn-icon btn-edit" onclick="prepararEdicion('${v.id}')"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn-icon btn-delete" onclick="eliminarVenta('${v.id}')"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tablaVentasBody.appendChild(tr);
            });
        }

        statTotalVentas.textContent = ventas.length;
        statMontoTotal.textContent = `$${montoAcumulado.toFixed(2)}`;
    }

    window.prepararEdicion = function(id) {
        const ventas = getVentas();
        const venta = ventas.find(v => v.id === id);
        if (!venta) return;

        ventaIdInput.value = venta.id;
        clienteInput.value = venta.cliente;
        productoInput.value = venta.producto;
        cantidadInput.value = venta.cantidad;
        precioInput.value = venta.precio;

        formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar Venta`;
        btnCancelar.classList.remove("hidden");
        formVenta.querySelector("button[type='submit']").innerHTML = `<i class="fa-solid fa-check"></i> Actualizar Venta`;
    };

    btnCancelar.addEventListener("click", () => {
        limpiarFormularioVenta();
    });

    function limpiarFormularioVenta() {
        formVenta.reset();
        ventaIdInput.value = "";
        formTitle.innerHTML = `<i class="fa-solid fa-cart-plus"></i> Registrar Venta`;
        btnCancelar.classList.add("hidden");
        formVenta.querySelector("button[type='submit']").innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Guardar Venta`;
    }

    window.eliminarVenta = function(id) {
        if (confirm("¿Deseas eliminar este registro de venta?")) {
            let ventas = getVentas();
            ventas = ventas.filter(v => v.id !== id);
            guardarVentasEnStorage(ventas);
            cargarVentas();
        }
    };
});