//const express = require('express');
import express from "express";
//const socketio = require('socket.io');
import { Server } from 'socket.io'
import http from "http"

export function StartServer() {
  const Instance = {};
  Instance.Express = express()
  Instance.HTTPRouter = express.Router()
  Instance.Express.use(function(req, res, next) {
      console.log("HTTP", req.ip, req.headers['host'], req.method, req.url)
      next();
  });
  Instance.Express.use(Instance.HTTPRouter);
  Instance.Express.use(function(req, res) {
    res.status(404)
    res.send("ERROR 404 Not Found")
    console.log("404", req.ip, req.headers['host'], req.method, req.url)
  });

  Instance.HTTP = http.Server(Instance.Express)
  Instance.HTTP.listen(process.env.PORT, "0.0.0.0", () => console.log(`Listening at http://`))
  Instance.IO = new Server(Instance.HTTP)
  Instance.HTTPRouter.use(express.static("pages"))
  return Instance
}
