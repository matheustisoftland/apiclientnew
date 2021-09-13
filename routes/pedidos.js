const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODAS AS MENSAGEM  
router.get('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM pedidos;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedidos => {
                        return {
                            id_pedidos: pedidos.id_pedidos,
                            quantidade: pedidos.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno os detalhes de um pedido especifico',
                                url: 'http://localhost:3000/pedidos/' + pedidos.id_pedidos



                            }

                        }

                    })
                }
                return res.status(200).send(response)
            }
        )

    });
});

//INSERE UMA MENSAGEM
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO pedidos (id_pedidos, id_produtos, quantidade) VALUES (?,?,?)',
            [req.body.id_pedidos, req.body.id_produtos, req.body.quantidade],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'pedido inserido com sucesso',
                    pedidoCriado: {
                        id_pedidos: result.id_pedidos,
                        id_produtos: req.body.id_produtos,
                        quantidade: req.body.quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'pedido inserido',
                            url: 'http://localhost:3000/pedidos'

                        }
                    }

                }
                return res.status(201).send(response)

            }
        )

    });
});

//ALTERA UMA MENSAGEM
router.patch('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'MENSAGEM foi alterada'
    })

});

//DELETA UMA MENSAGEM
router.delete('/', (req, res, next) => {
    res.status(201).send({
        mensagem: 'MENSAGEM Excluida'
    })

});

module.exports = router;