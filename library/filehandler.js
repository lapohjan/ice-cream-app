'use strict';
const fs = require('fs')
const path = require('path')
const MIMETYPES = require('./mimetypes.json');
const read = filepath => {
    let extension = path.extname(filepath).toLowerCase();
    let mime = MIMETYPES[extension] || {
        type: 'application/octet-stream',
        encodin: 'binary'
    };
    return new Promise((resolve, reject) => {
        fs.readFile(filepath, mime.encoding, (err, fileData) => {
            if (err) {
                reject(err);
            } else {
                resolve({ fileData, mime });
            }
        })
    })
}
const send = (res, resource) => {
    res.writeHead(200, {
        'Content-Type': resource.mime.type,
        'Content-Length': Buffer.byteLength(resource.fileData, resource.mime.encoding)
    })
    res.end(resource.fileData, resource.mime.encoding)
}
const sendJson = (res, jsonResource) => {
    const jsonData = JSON.stringify(jsonResource);
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(jsonData)
}
const sendError = (res, message) => {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf8' })
    res.end(JSON.stringify({ message }))
}
const isIn = (route, ...routes) => {
    for (let start of routes) {
        if (route.startsWith(start))
            return true
    }
    return false
}
module.exports = { read, send, sendJson, sendError, isIn }