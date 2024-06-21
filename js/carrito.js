"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // nodos DOM
    let formularioPedido = document.querySelector("#formulario");
    // botones
    const btnEnviar = document.querySelector("#btnEnviar");
    const btnEnviarx3 = document.querySelector("#btnEnviarx3");
    const btnBuscar = document.querySelector("#btnBuscar");
    const btnCaptcha = document.querySelector("#comprobarCaptcha");
    const btnEnviarModificacion = document.querySelector("#btnModificar");

    // resultado de cada peticion

    btnEnviarModificacion.disabled = true;
    btnEnviarModificacion.classList.add("disabled");

    const mostrarCaptcha = document.querySelector("#mostrarCaptcha");
    const tablaPedidos = document.querySelector("#tabla-alimentos");

    const url = "https://666cb6cf49dbc5d7145ef2b0.mockapi.io/api";

    // bandera para el captcha
    let captchaValido = false;

    let idPut = "";

    // listeners
    formularioPedido.addEventListener("submit", (e) => {
        e.preventDefault();
    });

    btnCaptcha.addEventListener("click", validarCaptcha);
    btnEnviar.addEventListener("click", () => enviarPedido(url));
    btnEnviarx3.addEventListener("click", () => { for (let i = 0; i < 3; i++) enviarPedido(url) });
    btnBuscar.addEventListener("click", () => buscar(url))
    btnEnviarModificacion.addEventListener("click", () => {
        modificarUsuario(url);
        btnEnviarModificacion.disabled = true;
    });

    // tabla dinamica
    mostrarPedidos(url);

    async function enviarPedido(url) {
        let datosForm = new FormData(formularioPedido);

        let pedido = {
            "producto": datosForm.get("alimentos"),
            "cantidad": Number(datosForm.get("cantidad")),
            "cliente": datosForm.get("nombre"),
            "correo": datosForm.get("correo")
        };

        let options = {
            "method": "POST",
            "headers": { "Content-Type": "application/json" },
            "body": JSON.stringify(pedido)
        };

        if (captchaValido) {
            try {
                let response = await fetch(url + "/alimentos", options);
                if (response.ok)
                    mostrarPedidos(url);
            } catch (error) {
                // manejar error!!!!
            }
        }
    }

    async function mostrarPedidos(url) {
        try {
            let response = await fetch(url + "/alimentos");
            
            if (!response.ok)
                throw new Error("404 error");

            let pedidos = await response.json();

            tablaPedidos.innerHTML =
                `<thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Cliente</th>
                    </tr>
                </thead>`;

            let tbody = document.createElement('tbody');

            pedidos.forEach(pedido => {
                let tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${pedido.producto}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.cliente}</td>
                    <td>
                    <button class="btnBorrar" data-id="${pedido.id}">Eliminar</button>
                    <button class="btnEditar" data-id="${pedido.id}">Editar</button>
                    </td>
                    `;
                tbody.appendChild(tr);
            });

            tablaPedidos.appendChild(tbody);

            let deleteBtns = document.querySelectorAll(".btnBorrar");
            let modificarBtns = document.querySelectorAll(".btnEditar");

            deleteBtns.forEach(btn => btn.addEventListener("click", (e) => {
                let id = e.target.getAttribute("data-id");
                eliminarUsuario(id);
            }));

            modificarBtns.forEach(btn => btn.addEventListener("click", (e) => {
                window.location.href = "#form-container";
                let id = e.target.getAttribute("data-id");
                traerUsuario(id);
            }))

        } catch (error) {
            // manejar error!!!!
        }
    }

    async function eliminarUsuario(id) {
        const option = {
            "method": "DELETE"
        }
        try {
            let response = await fetch(url + `/alimentos/${id}`, option);
            if (!response.ok)
                throw new Error("El pedido no pudo ser eliminado");
            mostrarPedidos(url);

        } catch (error) {
            // manejar error!!!!
        }
    }

    async function modificarUsuario(url) {
        let datosForm = new FormData(formularioPedido);

        let pedidoModificado = {
            "producto": datosForm.get("alimentos"),
            "cantidad": Number(datosForm.get("cantidad")),
            "cliente": datosForm.get("nombre"),
            "correo": datosForm.get("correo")
        };

        try {
            let response = await fetch(url+"/alimentos/"+idPut, {
                "method": "PUT",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(pedidoModificado)
            });

            if (!response.ok)
                throw new Error("Error");

            alert("Modificacion exitosa");
            mostrarPedidos(url);

            btnEnviar.disabled = false;
            btnEnviarx3.disabled = false;

            btnEnviar.classList.remove("disabled");
            btnEnviarx3.classList.remove("disabled");

        } catch (error) {
            // manejar error
        }
    }

    async function traerUsuario(id) {
        idPut = id;

        btnEnviarModificacion.disabled = false;
        btnEnviarModificacion.classList.remove("disabled");

        btnEnviar.disabled = true;
        btnEnviarx3.disabled = true;

        btnEnviar.classList.add("disabled");
        btnEnviarx3.classList.add("disabled");
        
        try {
            let response = await fetch(url+"/alimentos/"+id);
            
            if (!response.ok)
                throw new Error('error al cargar los pedidos');

            let pedido = await response.json();

            formularioPedido.elements["alimentos"].value = pedido.producto;
            formularioPedido.elements["cantidad"].value = pedido.cantidad;
            formularioPedido.elements["nombre"].value = pedido.cliente;
            formularioPedido.elements["correo"].value = pedido.correo;
            
        } catch (error) {
            // manejar error
        }
    }

    // filtro por nombre de cliente
    async function buscar(url) {
        const filtroValue = document.querySelector("#filtro").value;
        try {
            let response = await fetch(url + "/alimentos");

            if (!response.ok)
                throw new Error('404 error');

            let pedidos = await response.json();

            tablaPedidos.innerHTML =
                `<thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Cliente</th>
            </tr>
        </thead>`;

            let tbody = document.createElement("tbody");

            pedidos.forEach(pedido => {
                let nombreCliente = pedido.cliente;
                if (nombreCliente.toLowerCase().includes(filtroValue.toLowerCase())) {
                    let tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${pedido.producto}</td>
                    <td>${pedido.cantidad}</td>
                    <td>${pedido.cliente}</td>
                    <button class="btnBorrar" data-id="${pedido.id}">Eliminar</button>
                    <button class="btnEditar" data-id="${pedido.id}">Modificar</button>
                    `;

                    tbody.appendChild(tr);

                    let modificarBtns = document.querySelectorAll(".btnEditar");
                    let deleteBtns = document.querySelectorAll(".btnBorrar");

                    modificarBtns.forEach(btn >= btn.addEventListener("click", (e) => {
                        window.location.href = "#form-container";
                        let id = e.target.getAttribute("data-id");
                        traerUsuario(id);
                    }));

                    deleteBtns.forEach(btn => btn.addEventListener("click", (e) => {
                        let id = e.target.getAttribute("data-id");
                        eliminarUsuario(id);
                    }));
                }
            });

            tablaPedidos.appendChild(tbody);
        } catch (error) {
            //manejar error!!!
        }
    }

    // captcha
    let captchaAleatorio = generarCaptcha(6);
    mostrarCaptcha.innerHTML = captchaAleatorio;

    function validarCaptcha() {
        const valorUsuario = document.querySelector("#captcha");
        const resultado = document.querySelector("#resultadoCaptcha");
        resultado.classList.add("show");

        let valor = valorUsuario.value;

        if (valor == captchaAleatorio) {
            valorUsuario.classList.remove("incorrecto");
            valorUsuario.classList.add("correcto");

            resultado.innerHTML = "Captcha valido"
            resultado.classList.remove("incorrecto");
            resultado.classList.add("correcto");
            captchaValido = true;
        } else {
            valorUsuario.classList.remove("correcto");
            valorUsuario.classList.add("incorrecto");

            resultado.innerHTML = "Captcha invalido"
            resultado.classList.remove("correcto");
            resultado.classList.add("incorrecto");
            captchaValido = false;
        }
    }

    function generarCaptcha(cant) {
        let valores = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let resultado = "";

        for (let i = 0; i < cant; i++) {
            let indice = Math.floor(Math.random() * valores.length);
            resultado += valores.charAt(indice);
        }
        return resultado;
    }
});
