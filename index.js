const express = require('express')
const mysql = require('mysql')
const morgan = require('morgan')
const cors = require('cors')
const index = express()
index.use(cors())

index.use(morgan('short'))

function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'fellowship'
    })
}

index.get('/', (req, res) => {
    res.send('I AM ROOOOOOOT')
})
//full streamer list endpoint
index.get('/streamers', (req, res) => {
    //res.send('there should be streamers here from mysql')
    const connection = getConnection()
    
    const queryString = 'SELECT educators.*, GROUP_CONCAT(DISTINCT streamerlink ORDER BY streamerlink) AS streamerlinks FROM educators LEFT JOIN educatorlinks ON educators.id = educatorlinks.educatorid GROUP BY educators.id ORDER BY educators.field';
    //const quetyString = 'SELECT * FROM educators';

    connection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err)
            res.sendStatus(500)
            return
          }
        res.json(rows)
    })
    connection.end();
})
index.get('/streamers/add', (req, res) => {
    const connection = getConnection();
    const { name, image } = req.query;
    const INSERTQUERY = `UPDATE educators SET profileimg = '${image}' WHERE streamername = '${name}'`
    connection.query(INSERTQUERY, (err) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.send('Successful post');
        }
    })
    connection.end();
})

index.listen(3003, () =>{
    console.log('Listening on port 3003...')
})