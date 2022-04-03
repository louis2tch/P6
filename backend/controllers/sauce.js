const Sauce = require('../models/sauce');
const fs = require('fs');

//const jwt = require('jsonwebtoken');

exports.createSauce = (req, res, next)=>{
    const sauceOject = JSON.parse(req.body.sauce);
    delete sauceOject._id;
    const sauce = new Sauce({
        ...sauceOject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked:[],
        usersDisliked:[]

    });
    sauce.save()
    .then(()=>res.status(201).json({message: 'Objet enregistre' }))
    .catch(error => res.status(400).json({error:error |'impossiblie de creer la sauce'}));

};
 
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce), 
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({message: 'Objet modifie !'}))
    .catch(error => res.status(400).json({error})); 
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () =>{
            Sauce.deleteOne({ _id: req.params.id})
            .then(() => res.status(200).json({ message: 'Object supprime !'}))
            .catch(error => res.status(400).json({ error }));
        })
    })
    .catch(error => res.status(500).json({error}));
};

exports.getoneSauce = (req, res, next) =>{
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json(error)); 
};

exports.getSauce = (req, res, next)=>{
    Sauce.find()
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
}; 



exports.generateLike = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce =>{
        var like = sauce.likes;
        //const userid = sauce.userId;
        
        //const token = req.headers.authorization.split(' ')[1];
        //const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        //const userid_c = decodedToken.userId;
        const userid_c = req.auth.userId;
        
        var dislike = sauce.dislikes;
        var usersliked = sauce.usersLiked;
        var usersdisliked = sauce.usersDisliked;
        const val = JSON.parse(req.body.like); //from frontend
        
        var content='';
        if(val == 1) {
            like = like + 1;
            content =  { likes: like, $addToSet: {usersLiked: [userid_c]}, _id: req.params.id };
        }

        if(val == -1) {
            dislike = dislike + 1;
            content =  { dislikes: dislike, $addToSet: {usersDisliked: [userid_c]}, _id: req.params.id };
        }
        var c=""; 
        var d = "";
        if(val == 0){
            function checkUser(useri){
                if(useri == userid_c)
                return useri
            }

            like = like - 1;
            dislike = dislike - 1;
            c = usersliked.find(checkUser);
            d = usersdisliked.find(checkUser);
        
            if(typeof c !== "undefined")
            content =  { likes: like,  $pull: {"usersLiked": userid_c}, _id: req.params.id };
            
            if(typeof d !== "undefined")
            content =  { dislikes: dislike, $pull: {"usersDisliked": userid_c}, _id: req.params.id };
        
        }

       Sauce.updateOne({ _id: req.params.id}, content)
       .then(() => res.status(200).json({message: 'Like = '+ val +' a = '+userid_c}))
       .catch(error => res.status(400).json({error: error}));
    })
    .catch(error => res.status(400).json({error}));
}

