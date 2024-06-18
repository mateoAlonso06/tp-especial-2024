"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // menu de navegacion
    const menuDesplegable = document.querySelector("#btnToggle").addEventListener("click", desplegar);

    function desplegar() {
        const navbar = document.querySelector(".header_navbar").classList.toggle("show");
    }
});

