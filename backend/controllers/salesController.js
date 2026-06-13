const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create a new sale
// @route   POST /api/sales
exports.createSale = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // 1. Check if product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        // 2. Check stock availability
        if (product.quantity < quantity) {
            return res.status(400).json({ message: `Insufficient stock! Only ${product.quantity} left.` });
        }

        // 3. Calculate Total Price
        const totalPrice = product.price * quantity;

        // 4. Create Sale Record
        const sale = await Sale.create({
            product: productId,
            quantity,
            totalPrice,
            staff: req.user.id // Token se staff ki ID mil jaye gi
        });

        // 5. REDUCE STOCK (Bohat zaroori step)
        product.quantity -= quantity;
        await product.save();

        res.status(201).json({ message: "Sale successful", sale });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all sales history
exports.getSales = async (req, res) => {
    try {
        // Populate se humein product aur staff ki details bhi mil jayengi
        const sales = await Sale.find().populate('product', 'name price').populate('staff', 'name');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get Comprehensive Dashboard Report (Daily + Monthly)
exports.getDailyReport = async (req, res) => {
    try {
        const now = new Date();
        
        // Today's range
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        // Monthly range (First day of current month)
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // 1. Fetch Today's Stats
        const dailyStats = await Sale.aggregate([
            { $match: { createdAt: { $gte: startOfDay, $lte: endOfDay } } },
            {
                $group: {
                    _id: null,
                    totalSalesValue: { $sum: "$totalPrice" },
                    totalItemsSold: { $sum: "$quantity" }
                }
            }
        ]);

        // 2. Fetch Monthly Stats
        const monthlyStats = await Sale.aggregate([
            { $match: { createdAt: { $gte: firstDayOfMonth } } },
            {
                $group: {
                    _id: null,
                    totalSalesValue: { $sum: "$totalPrice" },
                    totalItemsSold: { $sum: "$quantity" }
                }
            }
        ]);

        // Dono ka data ek hi object mein merge karke bhej rahe hain
        res.json({
            totalSalesValue: dailyStats[0]?.totalSalesValue || 0,
            totalItemsSold: dailyStats[0]?.totalItemsSold || 0,
            monthlySalesValue: monthlyStats[0]?.totalSalesValue || 0,
            monthlyItemsSold: monthlyStats[0]?.totalItemsSold || 0
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Monthly Sales Report
exports.getMonthlyReport = async (req, res) => {
    try {
        const date = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

        const report = await Sale.aggregate([
            {
                $match: {
                    createdAt: { $gte: firstDayOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSalesValue: { $sum: "$totalPrice" },
                    totalItemsSold: { $sum: "$quantity" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(report.length > 0 ? report[0] : { totalSalesValue: 0, totalItemsSold: 0, count: 0 });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};