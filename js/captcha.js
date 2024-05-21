"use strict"

// nodos DOM
const form = document.querySelector("#formulario").addEventListener("submit", enviar);
const mostrarCaptcha = document.querySelector("#mostrarCaptcha");

let captchaAleatorio = generarCaptcha(8);
mostrarCaptcha.innerHTML = captchaAleatorio;

function enviar(e) {
    e.preventDefault();
    // con el prevent default evitamos que el formulario se envie
    validarCaptcha(captchaAleatorio);
}   

function validarCaptcha(captchaAleatorio) {
    const valorUsuario = document.querySelector("#captcha");
    const resultado = document.querySelector("#resultadoCaptcha");
    resultado.classList.add("show");

    let valor = valorUsuario.value;

    if (valor == captchaAleatorio) {
        valorUsuario.classList.remove("incorrecto");
        valorUsuario.classList.add("correcto");

        resultado.innerHTML = "Captha valido"
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