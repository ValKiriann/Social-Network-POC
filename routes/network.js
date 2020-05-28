const express = require('express');
const users = require('./users.router');
const tests = require('./test.router');
const friends = require('./friends.router');

exports.routes = (server) => {
    server.use('/', tests);
    server.use('/user', users);
    server.use('/friends', friends);
}