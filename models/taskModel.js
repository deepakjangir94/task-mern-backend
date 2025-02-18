const mongoose = require("mongoose");
const taskSchema = mongoose.Schema(
    {
        text: {
            type: String, required: [true, 'Plaese add a task']
        },
        user: {
            type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Task', taskSchema)