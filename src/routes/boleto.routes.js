// import { Router } from "express"
const express = require('express')

//import { BoletoController } from "../resources/boleto/boleto.controllers"
const BoletoController = require("../resources/boleto/boleto.controllers")

const boletoRouter = express.Router()
const boletoController = new BoletoController()

boletoRouter.get('/:codigoBarras', boletoController.convenio)


//export default boletoRou
module.exports = boletoRouter