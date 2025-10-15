const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend: true}));

var mysqlConnection = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentdb',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{ 
    if(!err){

        console.log('Connection Established Successfully!!')
    }else{

        console.log('Connection Failed', err.message)
    }


})

app.post('/students', (req, res)=>{

mysqlConnection.query('INSERT INTO students(name, email,phone)VALUES(?,?,?)',
[req.body.name,req.body.email,req.body.phone], (err, response)=>{


    if(!err){
        res.send('Record Has Been Successfully added!!!')
    }else{
        throw err;
    }
    });
});

app.get('/students',(req, res)=>{

    mysqlConnection.query('SELECT *FROM students', (err, rows, fields)=>{

 if(!err)
 {
     res.send(rows);
 }else
 {
     throw err;
 }
    });


});
app.get('/students/:id', (req, res)=>{

    mysqlConnection.query("SELECT *FROM students WHERE id=?",[req.params.id],(err, rows, fields)=>{

        if(!err)
        {
            res.send(rows);
            
        }else
        {
            throw err;
        }
    })
})
app.put('/students/:id', (req, res)=>{
    mysqlConnection.query("UPDATE students SET phone=? WHERE id=?",[req.body.phone, req.params.id],(err, rows, fields)=>{

        if(!err)
        {
            res.send('Record has been updated successfully');
            
        }else
        {
            throw err;
        }
    })

})   



app.delete('/students/:id', (req, res)=>{

    mysqlConnection.query("DELETE FROM students WHERE id=?",[req.params.id],(err, rows, fields)=>{

        if(!err)
        {
            res.send('Record has been deleted successfully!!!');
            
        }else
        {
            throw err;
        }
    })

})
app.listen(4900,()=>{

    console.log('Express is Running at localhost:port:4900');
})