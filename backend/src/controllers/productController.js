const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        // Parse JSON strings back to arrays
        const formattedProducts = products.map(p => ({
            ...p,
            id: p.productId, // Frontend expects 'id' to be the numeric/original string ID
            colors: JSON.parse(p.colors),
            features: JSON.parse(p.features)
        }));
        res.json(formattedProducts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const paramId = req.params.id;
        const numericId = parseInt(paramId, 10);

        const whereClause = isNaN(numericId)
            ? { id: paramId }
            : { OR: [{ id: paramId }, { productId: numericId }] };

        const product = await prisma.product.findFirst({ where: whereClause });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({
            ...product,
            id: product.productId,
            colors: JSON.parse(product.colors),
            features: JSON.parse(product.features)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

