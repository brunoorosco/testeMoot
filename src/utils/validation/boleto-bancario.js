const modulo10 = require('./modulo10-validador')
const modulo11 = require('./modulo11-validador')

exports.barCode = (code) => {
  if (!/^[0-9]{44}$/.test(cod)) return false
  const DV = cod[4]
  const bloco = cod.substring(0, 4) + cod.substring(5)
  return modulo11.bancario(bloco) === Number(DV)
}

exports.linhaDigitavel = (code, validarBlocos = false) => {
  if (!/^[0-9]{47}$/.test(cod)) return false
  const blocos = [{
    num: cod.substring(0, 9),
    DV: cod.substring(9, 10)
  },
  {
    num: cod.substring(10, 20),
    DV: cod.substring(20, 21)
  },
  {
    num: cod.substring(21, 31),
    DV: cod.substring(31, 32)
  }
  ]
  const validBlocos = validarBlocos ? blocos.every(e => modulo10(e.num) === Number(e.DV)) : true
  const validDV = boletoBancariobarCode(convertToBoletoBancariobarCode(cod))
  return validBlocos && validDV
}

exports.boleto = (code, validarBlocos = false) => {
  if (cod.length === 44) return boletoBancariobarCode(cod)
  if (cod.length === 47) return boletoBancarioLinhaDigitavel(code, validarBlocos)
  return false
}
