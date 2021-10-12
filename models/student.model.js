const mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: 'This field is required.'
    },
    regno: {
        type: String
    },
    branch: {
        type: String
    },
    city: {
        type: String
    }
});

mongoose.model('Student', studentSchema);