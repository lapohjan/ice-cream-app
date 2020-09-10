'use strict';

const {read}=require('./filehandler');

const filePath='./filehandler.js';

read(filePath).then(result=>console.log(result.fileData, result.mime))
.catch(err=>console.log(err.message));