// import { Router } from 'express'
const express = require('express')
const boletoRouter = require('./boleto.routes')

const router = express.Router()

router.use('/boleto', boletoRouter)

module.exports = router
