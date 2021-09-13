const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODAS AS LOTE 
router.get('/', (req, res, next) => {


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produtos: prod.id_produtos,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorno os detalhes de um produtos especifico',
                                url: 'http://localhost:3000/produtos/' + prod.id_produtos

                            }

                        }

                    })
                }
                return res.status(200).send(response)
            }
        )

    });
});




//INSERE UMA LOTE
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO produtos (id_produtos, nome, preco) VALUES (?,?,?)',
            [req.body.id_produtos, req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'produto inserido com sucesso',
                    produtoCriado: {
                        id_produtos: resultado.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produto',
                            url: 'http://localhost:3000/produtos'

                        }
                    }

                }
                return res.status(201).send(response)

            }
        )

    });
});

//RETORNA OS DADOS DE UM LOTE
router.get('/:id_produtos', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id_produtos   = ?;',
            [req.params.id_produtos],
            (error, result, fields) => {
                if (error) { return res.status(500).send({ error: error }) }

                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'não foi encontrado produto com esse ID'

                    })
                }
                const response = {

                    produtoS: {
                        id_produtos: result[0].id_produtos,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produto',
                            url: 'http://localhost:3000/produtos'

                        }
                    }

                }
                return res.status(200).send(response)
            }
        )

    });
});




//ALTERA UMA LOTE
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE produtos 
            SET nome          =?,
            preco             =?
            WHERE id_produtos  =?`,

            [
                req.body.nome,
                req.body.preco,
                req.body.id_produtos],

            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }

                const response = {
                    mensagem: 'produto atualizado com sucesso',
                    produtoAtualizado: {
                        id_produtos: req.body.id_produtos,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorno os detalhes de um produtos especifico',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produtos
                        }
                    }

                }
                return res.status(202).send(response)



            }
        )

    });


});

//DELETA UMA LOTE
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM produtos WHERE id_produtos =?`, [req.body.id_produtos],

            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {
                    mensagem: 'produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        Url: 'htttp://localhost:3000/produtos',
                        body: {
                            'nome': 'string',
                            'preco': 'Number'
                        }
                    }
                }
                res.status(202).send({
                    mensagem: 'mensagem removida com sucesso',
                    id_produtos: resultado.insertId
                })

            }
        )

    });

});

module.exports = router;