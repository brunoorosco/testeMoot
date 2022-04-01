const express = require('express')
const BoletoController = require('../../resources/boleto/boleto.controllers')

const boletoRouter = express.Router()

boletoRouter.get('/:barCode', BoletoController.dadosBoleto)

module.exports = boletoRouter
