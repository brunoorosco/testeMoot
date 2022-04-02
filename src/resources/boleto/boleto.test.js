class BoletoRouter {
  route(httpRequest) {
    if (!httpRequest.params.barCode) {
      return {
        status: 400
      }
    }

  }
}

const boletoConvenio = '84610000001-3 55000296202-9 20415003000-3 00422208750-6'
const boletoBancario = '21290001192110001210904475617405975870000002000'

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
})