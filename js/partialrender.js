"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const divContenido = document.querySelector("#contenedor-principal");
    
    let links = document.querySelectorAll(".nav-link");
    
    links.forEach(link => {
        let urlLink = link.getAttribute("href");
        link.addEventListener("click", (e) => {
            e.preventDefault();
            cargarContenido(urlLink)
        });
    });
    
    async function cargarContenido(urlLink) {
        try {
            let response = await fetch(urlLink);
            if (!response.ok)
                throw new Error("4O4 not found");

            let html = await response.text();

            divContenido.innerHTML = html;
        } catch (error) {
            console.log(error);
        }
    }
});