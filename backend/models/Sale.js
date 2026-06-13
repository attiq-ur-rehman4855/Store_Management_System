const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    staff: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Kisne sale ki
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);