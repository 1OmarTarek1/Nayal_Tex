// Utility to simulate sales transactions and manage stock
// Can be called manually from a button

// --- SALES SIMULATION ---
export const runSalesSimulation = (getAllProducts, updateVariantInventory, addTransaction) => {

    // --- Data Arrays ---
    const firstNames = ['محمد', 'أحمد', 'محمود', 'علي', 'عمر', 'حسن', 'يوسف', 'إبراهيم', 'خالد', 'مصطفى', 'عبدالله', 'سعيد', 'تامر', 'سيف', 'ياسر'];
    const middleNames = ['جابر', 'منصور', 'زكي', 'سالم', 'فتحي', 'سليمان', 'حسين', 'السيد', 'عبدالرحمن', 'فاري', 'عماد', 'كمال', 'جمال', 'سمير', 'عادل'];
    const lastNames = ['الشريف', 'العدوي', 'المصري', 'الهواري', 'السويسي', 'النمر', 'الأسيوطي', 'الجندي', 'العطار', 'النجار', 'الحداد', 'الخياط', 'صلاح', 'موسى', 'عيسى'];

    const prefixes = ['010', '011', '012', '015'];

    // --- Helper Functions ---
    const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    const generateRandomName = () => {
        return `${getRandomItem(firstNames)} ${getRandomItem(middleNames)} ${getRandomItem(lastNames)}`;
    };

    const generateRandomPhone = () => {
        const prefix = getRandomItem(prefixes);
        const uniqueNum = Math.floor(Math.random() * 100000000).toString().padStart(8, '0'); // 8 digits
        return `${prefix}${uniqueNum}`;
    };

    const generateRandomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
    };

    const allProducts = getAllProducts();
    if (allProducts.length === 0) {
        alert("لا توجد منتجات في المخزون للمحاكاة!");
        return;
    }

    console.log("products found: ", allProducts.length);
    console.log("Starting Manual Sales Simulation...");

    // Generate ~50 random transactions
    const numberOfTransactions = 50;

    // Date Range: Previous 5 months (Excluding current month)
    // Goal: Allow user to add a transaction "Today" and see the oldest of the 5 drop off.
    const today = new Date();
    // End Date = Last day of previous month
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    // Start Date = 5 months before that
    const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    let addedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < numberOfTransactions; i++) {
        const product = getRandomItem(allProducts);

        // Ensure we don't oversell (keep at least 20 in stock)
        if (product.inStock <= 20) {
            skippedCount++;
            continue;
        }

        const quantity = Math.floor(Math.random() * 5) + 1; // Sell 1 to 5 items
        const customerName = generateRandomName();
        const customerPhone = generateRandomPhone();
        const transactionDate = generateRandomDate(startDate, endDate);

        // 1. Update Inventory
        const newStock = product.inStock - quantity;
        const newSold = product.sold + quantity;

        // Update local object to reflect change for next iteration if same product picked
        product.inStock = newStock;
        product.sold = newSold;

        updateVariantInventory(product.typeId, product.shapeId, product.id, newStock, newSold);

        // 2. Create Transaction
        addTransaction({
            type: 'sell',
            amount: quantity,
            price: 0,
            recipientName: customerName,
            recipientPhone: customerPhone,
            date: transactionDate,
            notes: 'عملية بيع عشوائية (يدوي)',
            typeId: product.typeId,
            typeName: product.typeName,
            shapeId: product.shapeId,
            shapeName: product.shapeName,
            variantId: product.id,
            variantName: product.name,
            colorName: product.name,
            colorCode: product.code
        });

        addedCount++;
    }

    if (addedCount === 0) {
        alert(`❌ فشل في إضافة أي مبيعات!\n\nالسبب: جميع المنتجات المختارة عشوائياً مخزونها ضعيف (أقل من 20 قطعة).\n\nالحل: استخدم زر "إضافة 50 وحدة للكل" أولاً لزيادة المخزون.`);
    } else {
        let msg = `✅ تم بنجاح!\n\n- تمت إضافة: ${addedCount} عملية بيع.\n- التوزيع الزمني: آخر 5 شهور.`;
        if (skippedCount > 0) {
            msg += `\n- تم تخطي: ${skippedCount} محاولة (بسبب ضعف المخزون في المنتج المختار).`;
        }
        alert(msg);
    }

    console.log(`Manual Sales Simulation Complete! Added: ${addedCount}, Skipped: ${skippedCount}`);
};

// --- STOCK ADDITION (BULK IMPORT) ---
export const runStockAddition = (getAllProducts, updateVariantInventory, addTransaction) => {
    const allProducts = getAllProducts();
    if (allProducts.length === 0) {
        alert("لا توجد منتجات في المخزون!");
        return;
    }

    // Helper for date generation
    const generateRandomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
    };

    // Date Range: Previous 5 months (Excluding current month)
    const today = new Date();
    const endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    const startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const ADD_AMOUNT = 50;
    console.log(`Adding ${ADD_AMOUNT} units to all products (Date Distributed over PREVIOUS 5 months)...`);

    let updatedCount = 0;

    allProducts.forEach(product => {
        // 1. Add to stock
        const newStock = product.inStock + ADD_AMOUNT;
        // Don't change sold amount
        const currentSold = product.sold;

        // Random date for this specific addition transaction
        const transactionDate = generateRandomDate(startDate, endDate);

        updateVariantInventory(product.typeId, product.shapeId, product.id, newStock, currentSold);

        // 2. Record Transaction
        addTransaction({
            type: 'add',
            amount: ADD_AMOUNT,
            price: 0,
            recipientName: 'مسؤول النظام',
            notes: `Bulk import +${ADD_AMOUNT} units`,
            date: transactionDate, // Explicitly set random past date
            typeId: product.typeId,
            typeName: product.typeName,
            shapeId: product.shapeId,
            shapeName: product.shapeName,
            variantId: product.id,
            variantName: product.name,
            colorName: product.name,
            colorCode: product.code
        });
        updatedCount++;
    });

    alert(`تمت إضافة ${ADD_AMOUNT} وحدة لعدد ${updatedCount} منتج بنجاح!\n(تم توزيع تواريخ الإضافة عشوائياً على آخر 5 شهور)`);
    console.log(`Bulk Stock Addition Complete!`);
};
