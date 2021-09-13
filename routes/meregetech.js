const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//RETORNA TODAS AS LOTE 
router.get('/', (req, res, next) => {
    //  res.status(200).send({ 
    //mensagem: 'Retorna todas rotas' 

    //  })

    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM meregetech   ;',
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ Response: resultado })
            }
        )

    });
});



//INSERE UMA LOTE
router.post('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'INSERT INTO meregetech (id_meregetech, nome, preco) VALUES (?,?,?)',
            [req.body.id_meregetech, req.body.nome, req.body.preco],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }


                res.status(201).send({
                    mensagem: 'mensagem inserida com sucesso',
                    id_meregetech: resultado.insertId
                })

            }
        )

    });



});

//RETORNA OS DADOS DE UM LOTE
router.get('/:preco', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM meregetech WHERE preco = ?;',
            [req.params.preco],
            (error, resultado, fields) => {
                if (error) { return res.status(500).send({ error: error }) }
                return res.status(200).send({ Response: resultado })
            }
        )

    });
});


//ALTERA UMA LOTE
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `UPDATE meregetech 
            SET nome             =?,
            preco                =?
            WHERE id_meregetech  =?`,

            [
                req.body.nome,
                req.body.preco,
                req.body.id_meregetech],

            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }


                res.status(202).send({
                    mensagem: 'mensagem alterada com sucesso',
                    id_meregetech: resultado.insertId
                })

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


                res.status(202).send({
                    mensagem: 'mensagem removida com sucesso',
                    id_produtos: resultado.insertId
                })

            }
        )

    });

});




module.exports = router;