const express = require('express');
const PORT = 5000;
const app = express();
const cors = require('cors')
const mongoose = require('mongoose');

const { MONGODB_URL } = require('./config')

global.__basedir = __dirname;
mongoose.connect(MONGODB_URL);

mongoose.connection.on('connected', () => {
    console.log("DB Connected");
})
mongoose.connection.on("error", (error) => {
    console.log("Some error while connecting to DB");
})

require('./models/user_model');
require('./models/product_model')
require('./models/order_model')
require('./models/cart_model')


app.use(cors());
app.use(express.json());

app.use(require('./routes/user_route'));
app.use(require('./routes/product_route'));
app.use(require('./routes/file_route'))
app.use(require('./routes/order_router'))
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`)
});