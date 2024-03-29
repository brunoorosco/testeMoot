//= ============ Identificar tipo de código do boleto =============

function identificarTipoCodigo (codigo) {
  codigo = codigo.replace(/[^0-9]/g, '')

  if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!')

  if (codigo.length == 44) {
    return 'CODIGO_DE_BARRAS'
  } else if (codigo.length == 46 || codigo.length == 47 || codigo.length == 48) {
    return 'LINHA_DIGITAVEL'
  } else {
    return 'TAMANHO_INCORRETO'
  }
}

//= =================================================================
// ============= Identificar o tipo de boleto inserido =============

function identificarTipoBoleto (codigo) {
  codigo = codigo.replace(/[^0-9]/g, '')

  if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!')

  if (codigo.substr(0, 1) == '8') {
    return 'CONVENIO'
  } else {
    return 'BANCO'
  }
}

//= =================================================================
// ============= Identificar o código de referência para qual módulo
// usar para calcular os dígitos verificadores ======================

function identificarReferencia (codigo) {
  codigo = codigo.replace(/[^0-9]/g, '')

  const referencia = codigo.substr(2, 1)

  if (typeof codigo !== 'string') throw new TypeError('Insira uma string válida!')

  switch (referencia) {
    case '6':
      return {
        mod: 10,
        efetivo: true
      }
      break
    case '7':
      return {
        mod: 10,
        efetivo: false
      }
      break
    case '8':
      return {
        mod: 11,
        efetivo: true
      }
      break
    case '9':
      return {
        mod: 11,
        efetivo: false
      }
      break
    default:
      break
  }
}

//= ======================================================================
// ============= Identificar a data de vencimento do boleto =============

function identificarData (codigo) {
  const tipoBoleto = identificarTipoBoleto(codigo)

  let fatorData = ''
  let dataBoleto = new Date()

  dataBoleto.setFullYear(1997)
  dataBoleto.setMonth(9)
  dataBoleto.setDate(7)

  if (tipoBoleto == 'BANCO') {
    fatorData = codigo.substr(33, 4)
    dataBoleto.setDate(dataBoleto.getDate() + Number(fatorData))
    dataBoleto.setTime(dataBoleto.getTime() + dataBoleto.getTimezoneOffset() - (3) * 60 * 60 * 1000)

    const dataBoletoform = `${dataBoleto.getFullYear()}-${(dataBoleto.getMonth() + 1)}-${dataBoleto.getDate()}`

    return dataBoletoform
  } else {
  
    dataBoleto = null
    return dataBoleto
  }
}

//= =============================================================================
// ============= Identificar o preço do boleto do tipo arrecadação =============

function identificarValorCodBarrasArrecadacao (codigo) {
  const isValorEfetivo = identificarReferencia(codigo).efetivo

  let valorBoleto = ''
  let valorFinal

  if (isValorEfetivo) {
    valorBoleto = codigo.substr(4, 14)
    valorBoleto = codigo.split('')
    valorBoleto.splice(11, 1)
    valorBoleto = valorBoleto.join('')
    valorBoleto = valorBoleto.substr(4, 11)

    valorFinal = valorBoleto.substr(0, 9).replace(/^0+/, '') + '.' + valorBoleto.substr(9, 2)
  } else {
    valorFinal = 0
  }

  return valorFinal
}

//= =========================================================
// ============= Identificar o preço do boleto =============

function identificarValor (codigo) {
  const tipoBoleto = identificarTipoBoleto(codigo)

  let valorBoleto = ''
  let valorFinal

  if (tipoBoleto == 'BANCO') {
    valorBoleto = codigo.substr(37)
    valorFinal = valorBoleto.substr(0, 8).replace(/^0+/, '') + '.' + valorBoleto.substr(8, 2)
  } else {
    valorFinal = identificarValorCodBarrasArrecadacao(codigo)
  }

  return valorFinal
}

//= =======================================================================================
// ============= Identificar o módulo para calcular os dígitos verificadores =============

function digitosVerificadores (codigo, mod) {
  switch (mod) {
    case 10:
      return (codigo + calculaMod10(codigo)).toString()
      break
    case 11:
      return (codigo + calculaMod11(codigo)).toString()
      break
    default:
      break
  }
}

//= ===========================================================================
// ============= Converter o código de barras em linha digitável =============

function codBarras2LinhaDigitavel (codigo, formatada) {
  const tipoBoleto = identificarTipoBoleto(codigo)

  let resultado = ''

  if (tipoBoleto == 'BANCO') {
    const novaLinha = codigo.substr(0, 4) + codigo.substr(19, 25) + codigo.substr(4, 1) + codigo.substr(5, 14)

    const bloco1 = novaLinha.substr(0, 9) + calculaMod10(novaLinha.substr(0, 9))
    const bloco2 = novaLinha.substr(9, 10) + calculaMod10(novaLinha.substr(9, 10))
    const bloco3 = novaLinha.substr(19, 10) + calculaMod10(novaLinha.substr(19, 10))
    const bloco4 = novaLinha.substr(29)

    resultado = (bloco1 + bloco2 + bloco3 + bloco4).toString()

    if (formatada) {
      resultado =
                resultado.slice(0, 5) +
                '.' +
                resultado.slice(5, 10) +
                ' ' +
                resultado.slice(10, 15) +
                '.' +
                resultado.slice(15, 21) +
                ' ' +
                resultado.slice(21, 26) +
                '.' +
                resultado.slice(26, 32) +
                ' ' +
                resultado.slice(32, 33) +
                ' ' +
                resultado.slice(33)
    }
  } else {
    const identificacaoValorRealOuReferencia = identificarReferencia(codigo)
    let bloco1
    let bloco2
    let bloco3
    let bloco4

    if (identificacaoValorRealOuReferencia.mod == 10) {
      bloco1 = codigo.substr(0, 11) + calculaMod10(codigo.substr(0, 11))
      bloco2 = codigo.substr(11, 11) + calculaMod10(codigo.substr(11, 11))
      bloco3 = codigo.substr(22, 11) + calculaMod10(codigo.substr(22, 11))
      bloco4 = codigo.substr(33, 11) + calculaMod10(codigo.substr(33, 11))
    } else if (identificacaoValorRealOuReferencia.mod == 11) {
      bloco1 = codigo.substr(0, 11) + calculaMod11(codigo.substr(0, 11))
      bloco2 = codigo.substr(11, 11) + calculaMod11(codigo.substr(11, 11))
      bloco3 = codigo.substr(22, 11) + calculaMod11(codigo.substr(22, 11))
      bloco4 = codigo.substr(33, 11) + calculaMod11(codigo.substr(33, 11))
    }

    resultado = bloco1 + bloco2 + bloco3 + bloco4
  }

  return resultado
}

//= ===========================================================================
// ============= Converter a linha digitável em código de barras =============

function linhaDigitavel2CodBarras (codigo) {
  const tipoBoleto = identificarTipoBoleto(codigo)

  let resultado = ''

  if (tipoBoleto == 'BANCO') {
    resultado = codigo.substr(0, 4) +
            codigo.substr(32, 1) +
            codigo.substr(33, 14) +
            codigo.substr(4, 5) +
            codigo.substr(10, 10) +
            codigo.substr(21, 10)
  } else {
    codigo = codigo.split('')
    codigo.splice(11, 1)
    codigo.splice(22, 1)
    codigo.splice(33, 1)
    codigo.splice(44, 1)
    codigo = codigo.join('')

    resultado = codigo
  }

  return resultado
}

//= =================================================================================================
// ============= Calcular o dígito verificador de toda a numeração do código de barras =============

function calculaDVCodBarras (codigo, posicaoCodigo, mod) {
  codigo = codigo.split('')
  codigo.splice(posicaoCodigo, 1)
  codigo = codigo.join('')

  if (mod === 10) {
    return calculaMod10(codigo)
  } else if (mod === 11) {
    return calculaMod11(codigo)
  }
}

//= ======================================================================
// ============= Identificar se o código de barras é válido =============

function validarCodigoComDV (codigo, tipoCodigo) {
  let tipoBoleto
  let resultado

  tipoBoleto = identificarTipoBoleto(codigo)

  if (tipoBoleto == 'BANCO') {
    const bloco1 = codigo.substr(0, 9) + calculaMod10(codigo.substr(0, 9))
    const bloco2 = codigo.substr(10, 10) + calculaMod10(codigo.substr(10, 10))
    const bloco3 = codigo.substr(21, 10) + calculaMod10(codigo.substr(21, 10))
    const bloco4 = codigo.substr(32, 1)
    const bloco5 = codigo.substr(33)

    resultado = (bloco1 + bloco2 + bloco3 + bloco4 + bloco5).toString()
  } else {
    const identificacaoValorRealOuReferencia = identificarReferencia(codigo)
    let bloco1
    let bloco2
    let bloco3
    let bloco4

    if (identificacaoValorRealOuReferencia.mod == 10) {
      bloco1 = codigo.substr(0, 11) + calculaMod10(codigo.substr(0, 11))
      bloco2 = codigo.substr(12, 11) + calculaMod10(codigo.substr(12, 11))
      bloco3 = codigo.substr(24, 11) + calculaMod10(codigo.substr(24, 11))
      bloco4 = codigo.substr(36, 11) + calculaMod10(codigo.substr(36, 11))
    } else if (identificacaoValorRealOuReferencia.mod == 11) {
      bloco1 = codigo.substr(0, 11)
      bloco2 = codigo.substr(12, 11)
      bloco3 = codigo.substr(24, 11)
      bloco4 = codigo.substr(36, 11)

      dv1 = parseInt(codigo.substr(11, 1))
      dv2 = parseInt(codigo.substr(23, 1))
      dv3 = parseInt(codigo.substr(35, 1))
      dv4 = parseInt(codigo.substr(47, 1))

      valid = (calculaMod11(bloco1) == dv1 &&
                calculaMod11(bloco2) == dv2 &&
                calculaMod11(bloco3) == dv3 &&
                calculaMod11(bloco4) == dv4)

      return valid
    }

    resultado = bloco1 + bloco2 + bloco3 + bloco4
  }
 
  return codigo === resultado
}

//= ============================================================================================
// ============= Calcular o digito verificador de numeração a partir do módulo 10 =============

function calculaMod10 (numero) {
  numero = numero.replace(/\D/g, '')
  let i
  let mult = 2
  let soma = 0
  let s = ''

  for (i = numero.length - 1; i >= 0; i--) {
    s = (mult * parseInt(numero.charAt(i))) + s
    if (--mult < 1) {
      mult = 2
    }
  }
  for (i = 0; i < s.length; i++) {
    soma = soma + parseInt(s.charAt(i))
  }
  soma = soma % 10
  if (soma != 0) {
    soma = 10 - soma
  }
  return soma
}

//= ============================================================================================
// ============= Calcular o digito verificador de numeração a partir do módulo 11 =============

function calculaMod11 (x) {
  const sequencia = [4, 3, 2, 9, 8, 7, 6, 5]
  let digit = 0
  let j = 0
  let DAC = 0

  for (let i = 0; i < x.length; i++) {
    const mult = sequencia[j]
    j++
    j %= sequencia.length
    digit += mult * parseInt(x.charAt(i))
  }

  DAC = 11 - (digit % 11)

  if (DAC == 0 || DAC == 1 || DAC == 10 || DAC == 11) { return 1 } else { return DAC }
}

//= ===================================================================================
// ============= Função auxiliar para remover os zeros no código inserido=============

function substringReplace (str, repl, inicio, tamanho) {
  if (inicio < 0) {
    inicio = inicio + str.length
  }

  tamanho = tamanho !== undefined ? tamanho : str.length
  if (tamanho < 0) {
    tamanho = tamanho + str.length - inicio
  }

  return [
    str.slice(0, inicio),
    repl.substr(0, tamanho),
    repl.slice(tamanho),
    str.slice(inicio + tamanho)
  ].join('')
}

//= ===========================================================================================

module.exports = {
  identificarTipoCodigo,
  identificarTipoBoleto,
  identificarReferencia,
  identificarData,
  identificarValorCodBarrasArrecadacao,
  identificarValor,
  digitosVerificadores,
  codBarras2LinhaDigitavel,
  linhaDigitavel2CodBarras,
  calculaDVCodBarras,
  validarCodigoComDV,
  calculaMod10,
  calculaMod11,
  substringReplace
}
