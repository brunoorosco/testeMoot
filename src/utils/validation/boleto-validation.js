const boletoBancario = require('./boleto-bancario')
const boletoConvenio = require('./boleto-convenio')
const cleanCod = require('../helpers/limpa-codigoBarra')

// ============= Fazer validação do boleto =============
exports.validarBoleto = (code, validarBlocos = false) => {
  if (Number(code[0]) === 8) return boletoConvenio.boleto(code, validarBlocos)
  return boletoBancario.boleto(code, validarBlocos)
}
