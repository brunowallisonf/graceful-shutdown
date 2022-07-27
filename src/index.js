import { createServer } from "node:http"
import  { once } from "node:events"
async function handler (request, response){
    console.log("here")
    try {
        const data = JSON.parse(await once(request,'data'))
        console.log(data)
        response.writeHead(200)
        response.end(JSON.stringify(data))
        setTimeout(() => {
            throw new Error('will be handled on uncaught')
        }, 1000);
        Promise.reject("Will be handled on unhandledRejection")
    } catch (error) {
        console.error("Deu ruim ",error.stack)
        response.writeHead(500)
        response.end()
    }
}
const server  = createServer(handler).listen(3001)
.on("listening",() => console.log("server listening on port 3000"))

process.on('uncaughtException',(error) => {
    console.log(`\n signal received ${error}`)
})

process.on('unhandledRejection',(error) => {
    console.log(`\n signal received ${error}`)
})

function gracefulShutdown(event){
    return (code) => {
        console.log(`${event} Received! with code`,code)
        server.close(() => {
            console.log("HttpServer close")
            
            process.exit(code)
        })
    }
}

// gracefulshutdown
// Disparado no ctrl C
process.on("SIGINT",gracefulShutdown('SIGINT'))
process.on("SIGTERM",gracefulShutdown('SIGTERM'))

