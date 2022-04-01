const {validarBoleto} = require('../../utils/validation/boleto-validation')



const boletoConvenio = '84610000001-3 55000296202-9 20415003000-3 00422208750-6'
const boletoBancario = '21290001192110001210904475617405975870000002000'


test('boleto Válido', () => {
  expect(validarBoleto(boletoBancario, 2)).toBe({staus: 200});
});