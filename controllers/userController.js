const { Thought, User } = require('../models');

module.exports = {
    getUsers(req, res){
        User.find().populate('thoughts').populate('friends').then((users) => res.json(users)).catch(
            (err) => {
                console.log(err)
                res.status(500).json(err)

            }
        )
    },
    getSingleUser(req, res){
        User.findOne({_id:req.params.userId}).populate('thoughts').populate('friends').then(
            (user) =>
             !user
              ? res.status(404).json({message: 'No user with that Id'})
              : res.json(user)
        ).catch(
            (err) => res.status(500).json(err)
        );
    },
    createUser(req, res){
        User.create(req.body).then(
            (user)=> res.json(user)
        ).catch(
            (err) => res.status(500).json(err)
        );
    },
    deleteUser(req, res){
        User.findOneAndDelete({_id: req.params.userId}).then(
            (user) =>
             !user
              ? res.status(404).json({message: 'No user with that ID'})
              : res.json({message: "User deleted"})
        ).catch(
            (err) => res.status(500).json(err)
        );
    },
    updateUser(req, res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            { runValidators: true, new: true}
        ).then((user) =>
         !user
          ? res.status(404).json({message: 'No user with that ID'})
          : res.json(user) 
        )
    },
    addFriend(req, res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            { runValidators: true, new: true }
        ).then((user)=>
          !user
            ? res.status(404).json({message: 'No user with that ID'})
            : res.json(user) 
        )
    },
    deleteFriend(req, res){
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            { runValidators: true, new: true }
        ).then((user)=>
          !user
            ? res.status(404).json({message: 'No user with that ID'})
            : res.json(user) 
        )
    }
}