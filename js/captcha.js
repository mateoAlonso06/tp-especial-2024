"use strict"

document.addEventListener("DOMContentLoaded", () => {
    // nodos DOM
    const formularioPedido = document.querySelector("#formulario");
    const btnEnviar = document.querySelector("#btnEnviar");
    const btnCaptcha = document.querySelector("#comprobarCaptcha");
    const mostrarCaptcha = document.querySelector("#mostrarCaptcha");
    const tablaPedidos = document.querySelector("#tabla-alimentos");

    const url = "https://666cb6cf49dbc5d7145ef2b0.mockapi.io/api";

    // listeners
    formularioPedido.addEventListener("submit", (e) => e.preventDefault());
    btnCaptcha.addEventListener("click", validarCaptcha);
    btnEnviar.addEventListener("click", () => enviarPedido(url));

    // tabla dinamica
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
        }

        try {
            let response = await fetch(url + "/alimentos", options);
            if (response.ok)
                mostrarPedidos(url);
            else
                console.log("error al realizar el pedido");
        } catch (error) {
            console.log(error);
        }
    }

    mostrarPedidos(url);

    async function mostrarPedidos(url) {
        try {
            let response = await fetch(url + "/alimentos");
            let pedidos = await response.json();

            if (!response.ok)
                throw new Error("404 error");

            tablaPedidos.innerHTML =
                `<thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Id</th>
                </tr>
            </thead>`;

            for (let i = 0; i < pedidos.length; i++) {
                if (i < pedidos.length - 1) {
                    tablaPedidos.innerHTML +=
                        `<tbody>
                        <tr>
                            <td>${pedidos[i].producto}</td>
                            <td>${pedidos[i].cantidad}</td>
                            <td>${pedidos[i].cliente}</td>
                            <td>${pedidos[i].correo}</td>
                            <td>${pedidos[i].id}</td>
                            <td><button class="btnBorrar">Eliminar</button></td>
                        </tr>
                    </tbody>`
                    document.querySelector(".btnBorrar").addEventListener("click", () => eliminarUsuario(pedidos[i].id));
                } else {
                    tablaPedidos.innerHTML +=
                        `<tfoot>
                        <tr>
                            <td>${pedidos[i].producto}</td>
                            <td>${pedidos[i].cantidad}</td>
                            <td>${pedidos[i].cliente}</td>
                            <td>${pedidos[i].correo}</td>
                            <td>${pedidos[i].id}</td>
                            <td><button class="btnBorrar">Eliminar</button></td>
                        </tr>
                    </tfoot>`;
                    document.querySelector(".btnBorrar").addEventListener("click", () => eliminarUsuario(pedidos[i].id));
                }
            }
        } catch (error) {
            console.log(error);
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

            console.log("Pedido eliminado con exito");
            mostrarPedidos(url);

        } catch (error) {
            console.log(error);
        }
    }

    // captcha
    let captchaAleatorio = generarCaptcha(8);
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

        } else {
            valorUsuario.classList.remove("correcto");
            valorUsuario.classList.add("incorrecto");

            resultado.innerHTML = "Captcha invalido"
            resultado.classList.remove("correcto");
            resultado.classList.add("incorrecto");
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
