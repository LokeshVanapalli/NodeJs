const Task = require('../models/Tasks')

const getAllTasks = async (req,res)=>{
    try {
        const tasks = await Task.find({})
        res.status(200).json({tasks, amount:tasks.length})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}
const createTasks = async (req,res)=>{
    try {
        const task = await Task.create(req.body)
        res.status(201).json({task});
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}
const getTask = async (req,res)=>{ 
    //console.log(req)
    try {
        const {id:taskID} = req.params;
        const task = await Task.findById({_id:taskID})
        if(!task){
            return res.status(404).json({msg:`no task with id ${taskID}`})
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}
const updateTasks = async (req,res)=>{
    try {
        const {id:taskID} = req.params;
        const task = await Task.findOneAndUpdate({_id:taskID},req.body, {
            new:true,
            runValidators:true
        })
        if(!task){
            return res.status(404).json({msg:`no task with id ${taskID}`})
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}
const deleteTasks = async (req,res)=>{
    try {
        const {id:taskID} = req.params;
        const task = await Task.findByIdAndDelete({_id:taskID})
        if(!task){
            return res.status(404).json({msg:`no task with id ${taskID}`})
        }
        res.status(200).json({task})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}


module.exports = {
    getAllTasks,
    createTasks,
    getTask,
    updateTasks,
    deleteTasks
}  