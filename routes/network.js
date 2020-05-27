const express = require('express');
const users = require('./users.router');
const tests = require('./test.router');

exports.routes = (server) => {
    server.use('/', tests);
    server.use('/user', users);
}