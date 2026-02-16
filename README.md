# WeboChan - Tablón de Mensajes y Encuestas

<pre>
 /$$      /$$           /$$                  /$$$$$$  /$$                          
| $$  /$ | $$          | $$                 /$$__  $$| $$                          
| $$ /$$$| $$  /$$$$$$ | $$$$$$$   /$$$$$$ | $$  \__/| $$$$$$$   /$$$$$$  /$$$$$$$ 
| $$/$$ $$ $$ /$$__  $$| $$__  $$ /$$__  $$| $$      | $$__  $$ |____  $$| $$__  $$
| $$$$_  $$$$| $$$$$$$$| $$  \ $$| $$  \ $$| $$      | $$  \ $$  /$$$$$$$| $$  \ $$
| $$$/ \  $$$| $$_____/| $$  | $$| $$  | $$| $$    $$| $$  | $$ /$$__  $$| $$  | $$
| $$/   \  $$|  $$$$$$$| $$$$$$$/|  $$$$$$/|  $$$$$$/| $$  | $$|  $$$$$$$| $$  | $$
|__/     \__/ \_______/|_______/  \______/  \______/ |__/  |__/ \_______/|__/  |__/
</pre>


Bienvenido a [WeboChan](https://webochan.vercel.app), el tablón de mensajes anónimos y encuestas para la comunidad Webo.

## Características

- Publica mensajes y encuestas de forma anónima.
- Comenta y responde a mensajes y encuestas.
- Vota en encuestas y visualiza resultados en tiempo real.
- Sistema de versiones para mensajes y comentarios.
- Interfaz moderna con React, Next.js y TailwindCSS.
- Backend seguro con Prisma y PostgreSQL.


## Inicio rápido
```bash
  git clone https://github.com/Dandrvms/webochan.git
```
Instalar dependencias y ejecutar
```bash
  npm install
  npm run dev
```

## Estructura del Proyecto

```
src
├───app
│   ├───api 			            # api routes
│   │   ├───auth	
│   │   │   ├───webin		
│   │   │   └───webout
│   │   ├───bot			          # bot entry
│   │   │   ├───comment
│   │   │   ├───delete
│   │   │   ├───edit
│   │   │   ├───getposts
│   │   │   ├───notify
│   │   │   │   ├───comments
│   │   │   │   ├───polls
│   │   │   │   └───posts
│   │   │   │       └───[id]
│   │   │   ├───post
│   │   │   └───scrape
│   │   │       ├───board
│   │   │       │   └───[boardId]
│   │   │       └───post
│   │   │           └───[id]
│   │   ├───comments
│   │   │   └───[id]
│   │   ├───comment_versions
│   │   │   └───[id]
│   │   ├───csrf-token
│   │   ├───fs
│   │   │   ├───execute
│   │   │   └───write
│   │   ├───messages
│   │   │   └───[id]
│   │   ├───polls
│   │   │   ├───votes
│   │   │   └───[id]
│   │   ├───poll_comments
│   │   │   └───[id]
│   │   ├───test
│   │   └───versions
│   │       └───[id]
│   ├───board			            # generic board structure
│   │   ├───polls
│   │   │   └───[pollId]
│   │   │       └───comments
│   │   └───[boardId]
│   │       └───[messageId]
│   │           └───comments
│   ├───bot			# bot section
│   ├───components		        # react components
│   │   ├───display
│   │   ├───engines
│   │   ├───forms
│   │   ├───modals
│   │   └───session
│   ├───faq			              # faq section
│   ├───fs			              # fs render
│   └───hooks
├───generated
│   └───prisma
│       └───runtime
├───libs
│   └───fs			              # fs backend
│       └───commands
├───scripts
└───utils

```





