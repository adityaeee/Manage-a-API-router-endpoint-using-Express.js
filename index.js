const express = require('express');
const { sendStatus } = require('express/lib/response');
const router = require('express').Router();

const  app = express();

const users = [
    {
        email: "email1@gmail.com",
        password: "1234"
    },
    {
        email: "email2@gmail.com",
        password: "1234"
    },
    {
        email: "email3@gmail.com",
        password: "1234"
    },  
];

const products = [
    {
        id: 1,
        name: "produk 1",
        price: 9000,
        description: "ini adalah produk 1",
    },
    {
        id: 2,
        name: "produk 2",
        price: 4000,
        description: "ini adalah produk 2",
    },
    {
        id: 3,
        name: "produk 3",
        price: 12000,
        description: "ini adalah produk 3",
    },
];


router.get("/product/all", function(req, res) {
    //select * from products where category
    res.json(products)
});

router.get("/product/:productId", function(req, res) {
    const id = req.params.productId
    
    const productDetail = products.filter(product => product.id == id)

    if(productDetail.length == 0) {
        res.json({message: "Produk tidak ditemukan"})
    }else {
        res.json(productDetail[0])
    }
})

router.get("product/category/:id")


router.post("/product", function(req, res, next) {
    console.log("middleware yang ini aman, ga terjadi masalah serius")
    //kalo belum login
    // return res.redirect("/user/login")
    next()

}, function(req, res) {
    //INSERT INTO products (name, price, description) values(req.body.name, req.body.price, req.body.description)
    
    //sanitize
    const lastId = products[products.length - 1].id
    const productBody = {
        id: lastId + 1,
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    };

    products.push(productBody)
    res.send({message: "Menambahkan produk dengan id: " + productBody.id })
})


const cekKetersediaanEmail = function(req, res, next) {
    //SELECT * FROM users where email = req.body.email
    const isEmailExist = users.filter((user) => user.email == req.body.email)

    //jika email ada maka next
    if(isEmailExist.length > 0) {
        req.userPassword = isEmailExist[0].password
        return next()
    }

    //jika tidak ada
    return res.sendStatus(401)
}

const loginFunction = function(req, res) {  
    const isAuthenticated = req.body.password == req.userPassword
    if(!isAuthenticated) {
        return res.json({message: "Password anda salah"})
    }
    return res.json({message: "User berhasil login", token: "asdfgh"})
}


router.post("/user/login", cekKetersediaanEmail, loginFunction)


app.use(express.json())
app.use(router);

module.exports = app.listen(8080, () => {
    console.log('Http Server started on port 8080')
})