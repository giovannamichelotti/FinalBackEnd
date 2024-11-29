//Forma para que no se reinicie infinitamente

Crear un nodemon.json y

{
    "ignore": [
        "./carpetaIgnorada/"
    ]
}

Sino:
"type": "module" -> Para importaciones y exportaciones

"scripts":
"dev": "node --watch index.js"