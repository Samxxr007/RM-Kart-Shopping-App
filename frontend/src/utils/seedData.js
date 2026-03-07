import { collection, addDoc, getDocs, query, limit, writeBatch } from "firebase/firestore";

const demoProducts = [
    {
        title: "Celestial Nexus Watch",
        description: "A precision timepiece featuring a starlight-infused dial and aeronautical-grade titanium casing. Water-resistant up to 100m.",
        price: 1250.00,
        category: "Accessories",
        stock: 12,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop"
    },
    {
        title: "Aura Soundscape Headphones",
        description: "Immersive spatial audio with pure beryllium drivers. 50-hour battery life and adaptive silk-touch ear cushions.",
        price: 450.00,
        category: "Electronics",
        stock: 25,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
    },
    {
        title: "Elysian Silk Throw",
        description: "Hand-woven from 100% mulberry silk. Adds a touch of ethereal elegance to any living space.",
        price: 185.00,
        category: "Home",
        stock: 40,
        image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop"
    },
    {
        title: "Obsidian Peak Backpack",
        description: "Vandal-proof ballistic nylon with magnetic rapid-access compartments and integrated solar charging.",
        price: 210.00,
        category: "Accessories",
        stock: 15,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop"
    },
    {
        title: "Lumina Desk Lamp",
        description: "Smart LED lighting with gesture control and wireless charging base. Adjustable color temperature for deep focus.",
        price: 89.00,
        category: "Home",
        stock: 60,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1974&auto=format&fit=crop"
    },
    {
        title: "Titanium Sculpt Coffee Dripper",
        description: "Aerodynamic design for perfect extraction. Minimalist aesthetic for the modern connoisseur.",
        price: 120.00,
        category: "Kitchen",
        stock: 20,
        image: "https://images.unsplash.com/photo-1544233726-0884c659974d?q=80&w=1974&auto=format&fit=crop"
    }
];

export const unseedDatabase = async (db) => {
    if (!window.confirm("WARNING: This will delete ALL products, orders, and users. Are you sure?")) {
        return;
    }

    try {
        const collections = ["products", "orders", "users"];
        for (const colName of collections) {
            const snapshot = await getDocs(collection(db, colName));
            if (snapshot.empty) continue;

            const batch = writeBatch(db);
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            await batch.commit();
            console.log(`Cleared collection: ${colName}`);
        }
        alert("Database unseeded successfully!");
    } catch (error) {
        console.error("Error unseeding database:", error);
        alert("Error unseeding database: " + error.message);
    }
};

export const seedDatabase = async (db) => {
    try {
        // Basic check to see if products already exist
        const q = query(collection(db, "products"), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            if (!window.confirm("The database already contains products. Do you want to add more demo data?")) {
                return;
            }
        }

        console.log("Seeding database...");
        const productRefs = demoProducts.map(product =>
            addDoc(collection(db, "products"), product)
        );

        await Promise.all(productRefs);
        alert("Database seeded successfully with premium demo products!");
    } catch (error) {
        console.error("Error seeding database:", error);
        alert("Error seeding database: " + error.message);
    }
};
