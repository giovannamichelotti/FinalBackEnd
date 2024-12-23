# TP Final Back End

API desarrollada en Node.js y express lo que permitió crear un sistema eficiente y escalable para procesar las solicitudes provenientes del [front end](https://github.com/giovannamichelotti/FinalFrontEnd). Esta API replica funcionalidades clave de una plataforma de mensajería como WhatsApp. 

## Librerías utilizadas

- bcrypt: para encriptar y verificar claves.
- cors: para permitir las conexiones del dominio del front.
- dotenv: para gestionar variables de entorno de manera sencilla y segura.
- express: para simplificar el manejo de rutas, solicitudes HTTP, respuestas y middlewares.
- form-data y mailgun.js: para interactuar con la API de Mailgun para el envío de mails.
- jsonwebtoken: para el control de rutas protegidas, generación y validación de token.
- mysql2: para ejecutar consultas y manejar conexiones a la base de datos MySQL.

## Aprendizajes

- Código bien estructurado de acuerdo a responsabilidades.
Sigue el principio SoC: separation of concerns.
- De la mano con lo anterior y siguiendo el patrón de diseño Repositorio, se utilizan clases para las representación (modelo) de las tablas de la base de datos.
- Uso de variables de entorno: para evitar tener datos sensibles en el repositorio usamos .env (en local) y el paquete dotenv para obtener la información. La configuración se hace en cada entorno. En Vercel quedan también configuradas como variables de entorno.
- Uso de middleware para verificar token de acceso y establecer el objeto del usuario logueado en el request.
- Clases ayudantes (helpers) para ejecutar código específico en distintos lugares.
Sigue el principio DRY: don’t repeat your self.
- Uso del try/catch para evitar que la aplicación se rompa. Se utiliza en los lugares donde se ejecuta código que pueda generar un error.
- Uso de métodos para validar y limpiar datos antes de llamar a las consultas a la base de datos.
- A nivel base de datos, uso de claves únicas para evitar duplicidad de usuarios y contactos.
Según estos errores, se definen mensajes especiales en el momento de crear o editar un contacto, o agregar un usuario.
- Uso del flujo registro-verificación de cuenta para agregar un nivel de seguridad extra al registro.
Esto permite validar que la persona que se está registrando es dueña del email que está queriendo usar.


## Dificultades

1. Programación orientada a objetos, y métodos estáticos.
2. Conexión de la API con la base de datos.
3. Para poder mandar mails no pude hacerlo con SMTP usando mi cuenta de gmail porque entendí que abrir una cuenta de gmail para permitir el uso de SMTP era inseguro. Busqué alternativas y vi que con Mailgun podía enviar mails gratis. Luego vi que era necesario un dominio para evitar la validación de los destinatarios. Eso me llevó a ver cómo apuntar un dominio para poder configurar servicios como la web o incluso el MX (mail exchange) para poder mandar mails desde Vercel. Finalmente, registré el dominio, quedó apuntado a Cloudflare que es una herramienta gratuita, y luego, para que utilice el dominio que había registrado:
    A. Para cada proyecto, agregué el dominio a Vercel.
    B. Configuré Mailgun.
    C. En base a la configuración de cada uno de los puntos anteriores, agregué los registros DNS al dominio en Cloudflare.