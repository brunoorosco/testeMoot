const modulo10 = require('./modulo10-validador')
const modulo11 = require('./modulo11-validador')

exports.codigoBarras = (code) => {
  if (!/^[0-9]{44}$/.test(cod) || Number(cod[0]) !== 8) return false
  const codigoMoeda = Number(cod[2])
  const DV = Number(cod[3])
  const bloco = cod.substring(0, 3) + cod.substring(4)
  let modulo
  if (codigoMoeda === 6 || codigoMoeda === 7) modulo = modulo10
  else if (codigoMoeda === 8 || codigoMoeda === 9) modulo = modulo11Arrecadacao
  else return false
  return modulo(bloco) === DV
}

exports.linhaDigitavel = (codigo, validarBlocos = false) => {
  if (!/^[0-9]{48}$/.test(cod) || Number(cod[0]) !== 8) return false
  const validDV = boletoArrecadacaoCodigoBarras(convertToBoletoArrecadacaoCodigoBarras(cod))
  if (!validarBlocos) return validDV
  const codigoMoeda = Number(cod[2])
  let modulo
  if (codigoMoeda === 6 || codigoMoeda === 7) modulo = modulo10
  else if (codigoMoeda === 8 || codigoMoeda === 9) modulo = modulo11.convenio
  else return false
  const blocos = Array.from({
    length: 4
  }, (v, index) => {
    const start = (11 * (index)) + index
    const end = (11 * (index + 1)) + index
    return {
      num: cod.substring(start, end),
      DV: cod.substring(end, end + 1)
    }
  })
  const validBlocos = blocos.every(e => modulo(e.num) === Number(e.DV))
  return validBlocos && validDV
}

exports.boleto = (code, validarBlocos = false) => {
  if (cod.length === 44) return boletoArrecadacaoCodigoBarras(cod)
  if (cod.length === 48) return boletoArrecadacaoLinhaDigitavel(code, validarBlocos)
  return false
}
