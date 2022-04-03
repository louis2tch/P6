const mongoose = require('mongoose');
const express = require('express');
const path = require('path');

const app = express(); 
app.use(express.json());

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


//mongodb+srv://tclo2:5society@cluster0.axifd.mongodb.net/piiquanteDB?retryWrites=true&w=majority

mongoose.connect('mongodb+srv://tclo2:5society@cluster0.axifd.mongodb.net/piiquanteDB?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});



app.use('/images', express.static(path.join(__dirname, 'images'))); //gestionnaire de routage pour acceder au doc images

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


/*app.use('/api/marche',(req, res, next)=>{
  res.status(200).json('ICI 2xx');
});*/


module.exports = app;