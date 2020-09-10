'use strict';

const http = require('http');
const url = require('url');
const path = require('path');

const port = process.env.PORT || 3000;
// const host = process.env.HOST || 'localhost';

const { read, send, sendJson, sendError, isIn}=
    require(path.join(__dirname, 'library', 'filehandler.js'));

const resourceRoutes=['/favicon', '/styles', '/js','/images'];
const homePath=path.join(__dirname, 'home.html');
const jsonPath=path.join(__dirname, 'iceCream.json');

const server=http.createServer(async (req, res)=>{
    let route=decodeURIComponent(url.parse(req.url, true).pathname);
    try{
        if(route==='/') {
            const result = await read(homePath);
            send(res, result);
        }
        else if (isIn(route, ...resourceRoutes)) {
            const result = await read(path.join(__dirname, route));
            send(res, result);
        }
        else if(route==='/all') {
            const data = await read(jsonPath);
            const iceCreams = JSON.parse(data.fileData);
            sendJson(res, Object.keys(iceCreams));
        }
        else if (route.startsWith('/icecreams')) {
            const pathParts=route.split('/');
            if(pathParts.length>2){
                const iceCreamFlavor = pathParts[2];
                const data = await read(jsonPath);
                const iceCreams = JSON.parse(data.fileData);
                if(Object.keys(iceCreams).includes(iceCreamFlavor)) {
                    sendJson(res, iceCreams[iceCreamFlavor]);
                }
                else {
                    sendError(res, 'Ice cream not found');
                }
            }  
        }
        else {
            sendError(res, 'Not found');
        }
    }
    catch(err) {
        sendError(res, err.message);
    }
});
server.listen(port,()=>console.log(`Server listening port ${port}`));
// server.listen(port, host,()=>console.log(`Server ${host} listening port ${port}`));