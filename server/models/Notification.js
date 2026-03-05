import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'error', 'success'],
        default: 'info'
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'recipientModel',
        required: true
    },
    recipientModel: {
        type: String,
        enum: ['User', 'Employee'],
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedEntity: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'relatedEntityType'
    },
    relatedEntityType: {
        type: String,
        enum: ['Invoice', 'Supply', 'Transfer', 'Product', 'Employee']
    }
}, {
    timestamps: true
});

// فهرسة للبحث السريع
notificationSchema.index({ recipient: 1, read: 1 });

export default mongoose.model('Notification', notificationSchema);
