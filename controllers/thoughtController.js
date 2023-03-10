const { User, Thought } = require('../models');

// Export the modules
module.exports = {
    getThought(req, res) {
        Thought.find()
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },
    // Get single Thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('__v')
        .populate('thoughts')
        .populate('friends')
        .then((thought) =>
        !thought
        ? res.status(404).json({message: 'No such thought with that ID'})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    //Create thought
    createThought(req, res) {
        Thought.create(req.body)
        .then((thought) => res.json(thought))
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        })
    },
    //Update a single Thought
    updateThought(req, res) {
        Thought.findOneAndUpdate( 
            { _id: req.params.thoughtId }, 
            { $set:req.body }, 
            { runValidators: true, new: true }
        )
        .then((user) => 
            !user 
            ? res.status(404).json({ message: 'No thought find with this ID!'})
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete Thought
    deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) => 
        !thought
        ? res.status(404).json({ message: 'No thought find with this ID!'})
        : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId }},
            { new: true }
        )
        
        )
        .then((user) =>
        !user
        ? res.status(404).json({ message: 'Thought deleted, but no user found'})
        : res.json({message: 'Thought has been deleted!'})
        )
        .catch((err) => res.status(500).json(err));
    },
    //Create a reaction
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body }},
            { runValidators: true, new: true  },
        )
        .then((thought) =>
        !thought
        ? res.status(404).json({message: 'No thought with that ID!'})
        : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete the reaction
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId }} },
            { runValidators: true, new: true },
        )
        .then((thought) => 
            !thought
            ? res.status(404).json({message: 'No thought found with this ID!'})
            : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
    }
}