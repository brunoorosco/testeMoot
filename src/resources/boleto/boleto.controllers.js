// import { Request, Response } from "express";
const express = require('express')
const modulo10 = require('../../utils/modulo10')
const modulo11 = require('../../utils/modulo11')


class BoletoController {

    async convenio(req, callback) {
        let { codigoBarras } = req.params

        /**
         * Caso venha com traço é retirado aqui 
         * */
        codigoBarras = codigoBarras.replace(/( |-)/g, '');// Caso venha com traço é retirado aqui

        console.log(codigoBarras.length)

        /**
         * verifica se são somente numeros e se tem 48 digitos 
         * */
        if (!/^[0-9]{48}$/.test(codigoBarras)) {
            return callback(new Error("Formato Inválido."), null);
        }

        /**
         * separa blocos de 12 em 12
         */
        let blocos = [];

        blocos[0] = codigoBarras.substr(0, 12);
        blocos[1] = codigoBarras.substr(12, 12);
        blocos[2] = codigoBarras.substr(24, 12);
        blocos[3] = codigoBarras.substr(36, 12);


        /**
         * Verifica se é o modulo 10 ou modulo 11.
         * Se o 3º digito for 6 ou 7 é modulo 10, se for 8 ou 9, então modulo 11.
         */
        let isModulo10 = ['6', '7'].indexOf(codigoBarras[2]) != -1;
        let valido = 0;

        blocos.forEach(function (bloco, index) {
            if (isModulo10) {
                modulo10(bloco, function (digitoVerificador) {
                    if (digitoVerificador == bloco[bloco.length - 1])
                        valido++;
                });
            } else {
                modulo11(bloco, function (digitoVerificador) {
                    if (digitoVerificador == bloco[bloco.length - 1])
                        valido++;
                });
            }

            if (blocos.length == index + 1) {
                return callback(null, valido == 4);
            }
        });
    }

    /**
     * Valida boletos do tipo fatura ou carnê.
     *
     * @example Exemplo: 42297.11504 00001.954411 60020.034520 2 68610000054659
     *
     * @param string linhaDigitavel Linha digitalizável com ou sem mascara.
     * @param function callback função de retorno.
     */
    async boleto(linhaDigitavel, callback) {
        linhaDigitavel = linhaDigitavel.replace(/( |\.)/g, '');

        if (!/^[0-9]{47}$/.test(linhaDigitavel)) {
            return callback(new Error("Invalid format."), null);
        }
        var codigoBarras =
            linhaDigitavel.substr(0, 4) +
            linhaDigitavel.substr(32, 15) +
            linhaDigitavel.substr(4, 5) +
            linhaDigitavel.substr(10, 10) +
            linhaDigitavel.substr(21, 10);

        var blocos = [];

        blocos[0] = linhaDigitavel.substr(0, 10);
        blocos[1] = linhaDigitavel.substr(10, 11);
        blocos[2] = linhaDigitavel.substr(21, 11);

        var valido = 0;
        blocos.forEach(function (bloco, index) {
            modulo10(bloco, function (digitoVerificador) {
                if (digitoVerificador == bloco[bloco.length - 1])
                    valido++;
            });

            if (blocos.length == index + 1) {
                if (modulo11_2(codigoBarras.substr(0, 4) + codigoBarras.substr(5, 39)) != codigoBarras.substr(4, 1)) {
                    return callback(null, false);
                }

                return callback(null, valido == 3);
            }
        });
    }

  

   

    modulo11_2(bloco) {
        var numero = bloco;
        //debug('Barra: '+numero);
        var soma = 0;
        var peso = 2;
        var base = 9;
        var resto = 0;
        var contador = numero.length - 1;
        //debug('tamanho:'+contador);
        // var numero = "12345678909";
        for (var i = contador; i >= 0; i--) {
            //alert( peso );
            soma = soma + (numero.substring(i, i + 1) * peso);
            //debug( i+': '+numero.substring(i,i+1) + ' * ' + peso + ' = ' +( numero.substring(i,i+1) * peso)+' soma='+ soma);
            if (peso < base) {
                peso++;
            } else {
                peso = 2;
            }
        }
        var digito = 11 - (soma % 11);
        //debug( '11 - ('+soma +'%11='+(soma % 11)+') = '+digito);
        if (digito > 9) digito = 0;
        /* Utilizar o dígito 1(um) sempre que o resultado do cálculo padrão for igual a 0(zero), 1(um) ou 10(dez). */
        if (digito == 0) digito = 1;
        return digito;
    }

   
}

module.exports = BoletoController