const boletoService = require('../../services/boleto/boleto.service')
const { cleanCod } = require('../../utils/helpers/limpa-codigoBarra')

// ============= Obter dados do boleto =============
exports.dadosBoleto = (req, res) => {
  const retorno = {}
  let code = req.params.barCode

  code = code.replace(/[^0-9]/g, '')
  code = cleanCod(code)

  const tipoCode = boletoService.identificarTipoCodigo(code)

  if (code.length != 44 && code.length != 46 && code.length != 47 && code.length != 48) {
    retorno.status = 400
    retorno.message = 'O código inserido possui ' + code.length + ' dígitos. Por favor insira uma numeração válida.'
  } else if (code.substr(0, 1) == '8' && code.length == 46 && code.length == 47) {
    retorno.status = 400
    retorno.message = 'Este tipo de boleto deve possuir 48 caracteres numéricos.'
  } else if (!boletoService.validarCodigoComDV(code, tipoCode)) {
    retorno.status = 400
    retorno.message = 'A validação do dígito verificador falhou. Insera a numeração correta!'
  } else {
    retorno.status = 200
    retorno.message = 'Boleto válido'
    retorno.barCode = boletoService.linhaDigitavel2CodBarras(code)
    retorno.expirationDate = boletoService.identificarData(code)
    retorno.amount = boletoService.identificarValor(code)
  }
  return res.json(retorno)
}
