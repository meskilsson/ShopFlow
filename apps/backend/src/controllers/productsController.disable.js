let products = [
    { id: 0, name: "T-shirt", price: 299, category: "Kläder", inStock: true  },
    { id: 1, name: "Jenas", price: 299, category: "Kläder", inStock: true  },
    { id: 2, name: "Hoodie", price: 299, category: "Kläder", inStock: true  },
    { id: 3, name: "Klänning", price: 299, category: "Kläder", inStock: true  },
    { id: 4, name: "Kjol", price: 299, category: "Kläder", inStock: true  },
    { id: 5, name: "Jacka", price: 299, category: "Kläder", inStock: true  },
    { id: 6, name: "Kavaj", price: 299, category: "Kläder", inStock: true  },
    { id: 7, name: "Tröja", price: 299, category: "Kläder", inStock: true  },
    { id: 8, name: "Skjorta", price: 299, category: "Kläder", inStock: true  },
    { id: 9, name: "Sneakers", price: 299, category: "Skor", inStock: true  },
    { id: 10, name: "Solglasögon", price: 299, category: "Accessoarer", inStock: true  },
    { id: 11, name: "Mössa", price: 299, category: "Accessoarer", inStock: true  },
    { id: 12, name: "Halsduk", price: 299, category: "Accessoarer", inStock: true  },
    { id: 13, name: "Handskar", price: 299, category: "Accessoarer", inStock: true  },
    { id: 14, name: "Ryggsäck", price: 299, category: "Accessoarer", inStock: true  },
]

// ---------------------- Visa alla produkter ---------------------- //
const getAllProducts = (req, res) => {
    const { category, inStock } = req.query;

    let result = [... products];

    if(category) {
        result = result.filter((p) => p.category === category); 
    };

    if(inStock !== undefined) {
        const wantInStock = req.query.inStock === 'true';
        result = result.filter((p) => p.inStock === wantInStock);
    };
    res.json({data: result})
};

// ---------------------- Visa specifik produkt med ID ---------------------- //
const getProductById = (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find((p) => p.id === id)

    if(!product) {
        return res.status(404).json({
            error: {
                code: 'PRODUCT_NOT_FOUND',
                message: `Produkt med id ${id} hittades ej`,
                status: 404
            }
        });
    };
    res.json({data: product})
};

// ---------------------- Skapa en produkt ---------------------- //
const createProduct = (req, res) => {
    const { name, price, inStock } = req.body;

    if(!name) {
        return res.status(400).json({
            error: {
                code: 'MISSING_NAME',
                message: 'Skriv in produktnamnet',
                status: 400
            }
        });
    };

    if(typeof price !== 'number') {
        return res.status(400).json({
            error: {
                code: 'MISSING_PRICE',
                message: 'Priset måste vara ett nummer',
                status: 400
            }
        });
    };

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        inStock: inStock ?? true,
    };

    products.push(newProduct);
    
    res.status(201).set('Location', `/api/v1/products/${newProduct.id}`).json({data: newProduct})
}

// ---------------------- Updatera en produkt ---------------------- //
const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex((p) => p.id === id);

    if(index === -1) {
        return res.status(404).json ({
            error: {
                code: 'PRODUCT_NOT_FOUND',
            message: `Produkt med id ${id} hittades ej`,
            status: 404
            }
        });
    };

    const { name, price, inStock } = req.body;
    products[index] = { id, name, price, inStock };
    res.json({ data: products[index] });
};

// ---------------------- Ta bort en produkt ---------------------- //
const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex((p) => p.id === id);

    if(index === -1) {
        return res.status(404).json({
            error: { 
                code: 'PRODUCT_NOT_FOUND',
                message: `Produkt med id ${id} hittades ej`,
                status: 404
             }
        });
    }

    products.splice(index, 1);
        return res.status(200).json({
        code: 'PRODUCT_DELETED',
        message: `Produkt med id ${id} har tagits bort`,
        status: 204
    });
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}

