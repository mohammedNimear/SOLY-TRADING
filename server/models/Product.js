
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true,
        min: 0
    },
    cost: {
        type: Number,
        min: 0,
        default: 0
    },
    category: String,
    sku: {
        type: String,
        unique: true,
        sparse: true
    },
    image: String,
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    }
}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);
