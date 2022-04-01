
exports.bancario = (bloco) => {
  const codigo = bloco.split('').reverse()
  let multiplicador = 2
  const somatorio = codigo.reduce((acc, current) => {
    const soma = Number(current) * multiplicador
    multiplicador = multiplicador === 9 ? 2 : multiplicador + 1
    return acc + soma
  }, 0)
  const restoDivisao = somatorio % 11
  const DV = 11 - restoDivisao
  if (DV === 0 || DV === 10 || DV === 11) return 1
  return DV
}

exports.convenio = (bloco) => {
  const codigo = bloco.split('').reverse()
  let multiplicador = 2
  const somatorio = codigo.reduce((acc, current) => {
    const soma = Number(current) * multiplicador
    multiplicador = multiplicador === 9 ? 2 : multiplicador + 1
    return acc + soma
  }, 0)
  const restoDivisao = somatorio % 11

  if (restoDivisao === 0 || restoDivisao === 1) {
    return 0
  }
  if (restoDivisao === 10) {
    return 1
  }
  const DV = 11 - restoDivisao
  return DV
}
