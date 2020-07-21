let express = require('express');
let app = express();
const nodemailer = require('nodemailer')
//public -папка, где хранится статика

app.use(express.static('public'));
app.use(express.json());

app.set('view engine', 'pug');
//подключение бд
let mysql = require('mysql');
//настройка модуля
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'taso1'
});

app.listen(3000, function(){
    console.log('page is ready for work');
});

app.get('/', function(req, res){
    con.query(
        'select * from кофе',
        function(error, result){
            if(error) throw error;
            let coffee = {};
            for(let i = 0; i<result.length; i++){
                coffee[result[i]['id']] = result[i];
            }
            res.render('main', {
                coffee: JSON.parse(JSON.stringify(coffee))
            });
        //console.log(JSON.parse(JSON.stringify(coffee)));
      });
});
app.get('/cat', function (req, res) {
    //console.log(req.query);
    let catId = req.query.id;

    let cat = new Promise(function(resolve, reject) {
        con.query(
            'SELECT * FROM категория WHERE Id='+catId,
                function (error, result) {
                    if (error) reject(error);
                    resolve(result);
                }
        );
    });

    let coffee = new Promise(function(resolve, reject) {
        con.query(
            'SELECT * FROM кофе WHERE Вид='+catId,
            function (error, result) {
                if (error) reject(error);
                resolve(result);
            }
        );
    });
    Promise.all([cat, coffee]).then(function (value) {
        res.render('cat', {
            cat: JSON.parse(JSON.stringify(value[0])),
            coffee: JSON.parse(JSON.stringify(value[1]))
        });
    });
});
app.get('/coffee', function(req, res){
    //console.log(req.query.id);
    con.query('select * from кофе where id='+req.query.id, function(error, result, fields){
        if(error) throw error;
        res.render('coffee', {coffee: JSON.parse(JSON.stringify(result))});
    });
});

app.get('/allOrders',function(req, res){
    con.query
    ("", function(error, result, fields){
        if(error) throw error;
        res.render('allOrders', { order: JSON.parse(JSON.stringify(result))});
    })
})
app.get('/item', function(req, res){
    con.query("select заявка.id_заказа as id, `данные о пользователе`.Имя as Имя,`данные о пользователе`.Фамилия as Фамилия, `данные о пользователе`.`Номер телефона` as `Номер телефона`, sum(заявка.amount*кофе.Цена) as summary, статус.`Имя статуса` as статус from заявка, кофе, заказ, статус, `данные о пользователе` where заявка.`id товара` = `кофе`.id and заявка.`id_заказа` ='"+req.query.id+"' and заказ.id='"+req.query.id+"' and `данные о пользователе`.id = заказ.`Id доставки` and `заказ`.`Id статуса` = статус.`Id`  group by заявка.id_заказа", function(error, result){
       if(error) throw error;
       res.render('item', {item: JSON.parse(JSON.stringify(result))});
    });
});

app.post('/category', function(req, res){
    con.query('select * from категория', function(error, result){
        if(error) throw error;
        //console.log(result);
        res.json(result);
    });
});

app.post('/get_all_statuses', function(req, res){
    con.query('select * from статус', function(error, result){
        if(error) throw error;
        console.log(result);
        res.json(result);
    });
});

// app.get('/status', function (req, res) {
//     console.log(Object.values(JSON.parse(JSON.stringify(req.server))));
//     let statId = req.query.id;

//         con.query(
//             "UPDATE `заказ` SET `Id статуса` = '"+statId+"' WHERE (`id` = '7');",
//             function (error, result) {
//                 if (error) throw error;
//                 res.json(result);
//             }
//         );
// });
app.post('/get_coffee_inform', function(req, res){
    //console.log(req.body.key);
    let coffeeId = req.body.key;
    if (req.body.length != 0 ){
        con.query("select id, Название, Цена from кофе where id in('"+req.body.key.join("','")+"');", function(error, result){
            if(error) throw error;
            //console.log(result);
            let coffeeMas = {};
            for (let i = 0; i < result.length; i++) {
            coffeeMas[result[i]['id']] = result[i];
            }
            res.json(coffeeMas);
        });
    }else{
        res.send('0');
    }
});

app.get('/search', function(req, res){
    let searchval = req.query.Название;
    //console.log(searchval);
    let search = new Promise(function(resolve, reject) {
        con.query(
            "select * from кофе where Название like '%"+searchval+"%'",
                function (error, result) {
                    if (error) reject(error);
                    resolve(result);
                    //console.log(result);
                }
        );
    });
    Promise.all([search]).then(function (value) {
        res.render('search', {
            searchval: searchval,
            coffee: JSON.parse(JSON.stringify(value[0]))
        });
    });
});
E
app.get('/order', function (req, res) {
    res.render('order');
})

app.post('/finish-order', function(req, res) {
    console.log(req.body);
    if (req.body.key.length != 0){
        let key = Object.keys(req.body.key);
        let keyVal = Object.values(req.body.key);
        console.log(key, keyVal);
        con.query(
            'SELECT id, Название, Цена FROM кофе WHERE id IN (' + key.join(',') + ')',
            function(err, result, fields) {
                if(err) throw err;
                let price =result['Цена'];
                console.log(price);
               
                //console.log('1');
            con.query("INSERT INTO `данные о пользователе` ( `Имя`, `Фамилия`, `Горд`, `Адрес`, `Номер телефона`) VALUES ('"+req.body.username+ "', '"+req.body.surname+"', '"+req.body.town+"', '"+req.body.address+"', '"+req.body.phone+"');",function (error, result) {
                if(error) throw error;
                let userId = result.insertId;
                //console.log(result.insertId);
                con.query("INSERT INTO заказ ( `Id доставки`, `Id статуса`) VALUES ('"+userId+ "', 1);",function (error, result) {
                    if(error) throw error;
                    let orderId = result.insertId;
                    console.log(orderId);
                    for (let i = 0; i < key.length; i++) {
                        con.query("INSERT INTO заявка ( `Id товара`, `id_заказа`, `amount`) VALUES ('"+key[i]+ "', '"+orderId+"','"+keyVal[i]+"');",function (error, result) {
                            if(error) throw error;
                        })  
                    }
                })
            })
        sendMail(req.body,result).catch(console.error);
            }
        )
    } else {
        res.send('0');
    }
})
async function sendMail(data, result) {
    let res = `<h2>Your Taso shop order</h2>`;
    let total = 0;
    for (let i = 0; i < result.length; i++){
        res += `<p>${result[i]['Название']} - ${data.key[result[i]['id']]} - ${result[i]['Цена']*data.key[result[i]['id']] }грн</p>`
        total += result[i]['Цена']*data.key[result[i]['id']];        
    }
    res += `<h3>${total}</h3>`;
    res += `<p>Name: ${data.username}</p>` ;
    res += `<p>Surname: ${data.surname}</p>` ;
    res += `<p>Phone: ${data.phone}</p>` ;
    res += `<p>Email: ${data.email}</p>` ;
    res += `<p>Town: ${data.town}</p>` ;
    res += `<p>Address: ${data.address}</p>` ;
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass // generated ethereal password
        }
    });
    let myOptions = {
        from: '<tasoShop@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: 'Taso order', // Subject line
        text: "Order", // plain text body
        html: res // html body
    }
    let info = await transporter.sendMail(myOptions);
    console.log("MessageSent: %s", info.messageId);
    console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));
    localStorage.removeItem('cart');
}