const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    name: {
        type:String,
        required: [true,'name is required'],
        trim: true,
        maxlength: [20,'name can\'t exceed 20 characters']
    },
    Completed: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task',TaskSchema);