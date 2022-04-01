//= = Convert bank pay to barCode ==//
exports.convertToBoletoBancariobarCode = (code) => {
  const cod = code
  let barCode = ''
  barCode += cod.substring(0, 3) // Identificação do banco
  barCode += cod.substring(3, 4) // Código da moeda
  barCode += cod.substring(32, 33) // DV
  barCode += cod.substring(33, 37) // Fator Vencimento
  barCode += cod.substring(37, 47) // Valor nominal
  barCode += cod.substring(4, 9) // Campo Livre Bloco 1
  barCode += cod.substring(10, 20) // Campo Livre Bloco 2
  barCode += cod.substring(21, 31) // Campo Livre Bloco 3
  return barCode
}
