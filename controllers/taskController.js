const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

const getTasks = asyncHandler(async(req, res) => {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json({tasks});
});

const setTask = asyncHandler(async(req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Please enter a task');
    }
    
    const task = await Task.create({ text : req.body.text, user: req.user.id });
    res.status(200).json(task);
})

const updateTask = asyncHandler(async(req, res) => {
    const task = await Task.findById(req.params.id);
    if(!task){
        res.status(400);
        throw new Error('Task not found');
    }

    const user = await User.findById(req.user.id);
    if( !user ){
        res.status(401);
        throw new Error ('No such user found');
    }

    if(task.user.toString() !== user.id) {
        res.status(401);
        throw new Error('User is not authorized to update');
    }

    const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(updateTask);
});

const deleteTask = asyncHandler(async(req, res) => {
    const task = await Task.findById(req.params.id)

    if(!task){
        res.status(400);
        throw new Error ('Task not found');
    }
    // console.log(task);

    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error ('No such user found');
    }

    // console.log('start_ ' + req.user.id + ' _end');
    // console.log(typeof(req.user.id));
    // console.log('start_ ' + task.user.toString() + ' _end');
    // console.log(typeof(task.user.toString()));

    var str1 = task.user.toString();
    var str2 = req.user.id;
    // console.log(str1);
    // console.log(str2);
    // str1 !== str2

    // task.user.toString !== req.user.id

    if (str1 !== str2){
        res.status(401);
        throw new Error ('User is not authorized to delete');
    }

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: `Task ${req.params.id} deleted`});
});

module.exports = { getTasks, setTask, updateTask, deleteTask };
