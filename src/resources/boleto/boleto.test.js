const cleanCode = require('../../utils/helpers/limpa-codigoBarra')

class BoletoRouter {
  route(httpRequest) {
    const boleto = httpRequest.params.barCode

    if (!boleto) {
      return {
        status: 400
      }
    }
    if (boleto.lenght !== 48) {
      return {
        status: 400
      }
    }

    if (boleto.lenght === 48) {
      if (cleanCode(boleto) === 48) {
        return {
          status: 200
        }
      }
    }

  }
}

const boletoConvenio = '84610000001-3 55000296202-9 20415003000-3 00422208750-0'
const boletoBancario = '212900011921' + '100012109040' + '475617405975' + '870000002000'

describe('boleto Router', () => {
  test('validação do boleto', () => {
    const sut = new BoletoRouter()
    const httpRequest = {
      params: {

      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
  })


  test('validação da quantidade de algarismo do boleto bancario', () => {
    const sut = new BoletoRouter()
    const httpRequest = {
      params: {
        barCode: boletoBancario
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
  })

  test('validação da quantidade de algarismo do boleto convênio', () => {
    const sut = new BoletoRouter()
    const httpRequest = {
      params: {
        barCode: boletoConvenio
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
  })

  test('validação da numeração do boleto convênio', () => {
    const sut = new BoletoRouter()
    const httpRequest = {
      params: {
        barCode: boletoConvenio
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.status).toBe(400)
  })
})