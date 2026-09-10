require("colors");
const dotenv = require("dotenv");

const Product = require("../../models/productModel");
const Brand = require("../../models/brandModel");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const dbConnection = require("../../config/database");

dotenv.config();

// Connect to DB
dbConnection();

// Admin user
const adminUser = {
  name: process.env.ADMIN_NAME,
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  role: "admin",
};

const brandData = {
  name: "Nike",
  slug: "nike",
  image:
    "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/nike-brand-logo.png",
};
const brandData2 = {
  name: "Adidas",
  slug: "adidas",
  image:
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
};

const categoryData = {
  name: "Men's Running Shoes",
  slug: "mens-running-shoes",
  image:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
};

const categoryDataArray = [
  {
    name: "Electronics",
    slug: "electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Smartphones",
    slug: "smartphones",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Laptops",
    slug: "laptops",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Watches",
    slug: "watches",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Home & Kitchen",
    slug: "home-kitchen",
    image:
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
  },
];

const brandDataArray = [
  {
    name: "Apple",
    slug: "apple",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Samsung",
    slug: "samsung",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sony",
    slug: "sony",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Dell",
    slug: "dell",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Lenovo",
    slug: "lenovo",
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
  },
];

const productData = [
  {
    title: "Nike Air Zoom Pegasus 41",
    slug: "nike-air-zoom-pegasus-41",
    description:
      "A versatile daily running shoe with responsive cushioning and a breathable upper, designed for everyday road running.",
    quantity: 45,
    sold: 12,
    price: 6499,
    priceAfterDiscount: 5999,
    availableColors: ["#111111", "#FFFFFF", "#2563EB"],
    imageCover:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.6,
    ratingsQuantity: 128,
  },

  {
    title: "Nike Revolution 7",
    slug: "nike-revolution-7",
    description:
      "Lightweight everyday running shoes with soft cushioning and a flexible outsole for comfortable daily runs and workouts.",
    quantity: 60,
    sold: 21,
    price: 3999,
    priceAfterDiscount: 3599,
    availableColors: ["#111111", "#6B7280", "#FFFFFF"],
    imageCover:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.4,
    ratingsQuantity: 96,
  },

  {
    title: "Nike Winflo 11",
    slug: "nike-winflo-11",
    description:
      "A comfortable neutral running shoe combining responsive cushioning with a supportive fit for everyday training.",
    quantity: 38,
    sold: 9,
    price: 5299,
    priceAfterDiscount: 4799,
    availableColors: ["#111111", "#DC2626", "#FFFFFF"],
    imageCover:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.5,
    ratingsQuantity: 74,
  },

  {
    title: "Nike Downshifter 13",
    slug: "nike-downshifter-13",
    description:
      "A lightweight running shoe with breathable mesh and cushioned support, suitable for running, walking and training.",
    quantity: 52,
    sold: 17,
    price: 3799,
    priceAfterDiscount: 3399,
    availableColors: ["#111111", "#2563EB", "#6B7280"],
    imageCover:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.3,
    ratingsQuantity: 61,
  },

  {
    title: "Nike Pegasus Trail 5",
    slug: "nike-pegasus-trail-5",
    description:
      "A versatile trail-running shoe built with responsive cushioning and durable traction for road-to-trail adventures.",
    quantity: 30,
    sold: 8,
    price: 7499,
    priceAfterDiscount: 6999,
    availableColors: ["#111111", "#16A34A", "#92400E"],
    imageCover:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.7,
    ratingsQuantity: 83,
  },

  {
    title: "Nike Structure 25",
    slug: "nike-structure-25",
    description:
      "A supportive daily running shoe designed with cushioned stability and a comfortable fit for regular road training.",
    quantity: 34,
    sold: 11,
    price: 6999,
    priceAfterDiscount: 6399,
    availableColors: ["#111111", "#FFFFFF", "#EA580C"],
    imageCover:
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.6,
    ratingsQuantity: 58,
  },

  {
    title: "Nike InfinityRN 4",
    slug: "nike-infinityrn-4",
    description:
      "A cushioned running shoe designed for comfortable everyday miles with a soft and responsive ride.",
    quantity: 27,
    sold: 7,
    price: 7299,
    priceAfterDiscount: 6799,
    availableColors: ["#111111", "#FFFFFF", "Orange"],
    imageCover:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.5,
    ratingsQuantity: 47,
  },

  {
    title: "Nike Vomero 18",
    slug: "nike-vomero-18",
    description:
      "A premium cushioned running shoe offering a soft, comfortable ride for everyday road running and long-distance training.",
    quantity: 25,
    sold: 5,
    price: 7999,
    priceAfterDiscount: 7499,
    availableColors: ["#111111", "#FFFFFF", "#6B7280"],
    imageCover:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.8,
    ratingsQuantity: 39,
  },

  {
    title: "Nike Pegasus Plus",
    slug: "nike-pegasus-plus",
    description:
      "A lightweight performance running shoe with responsive cushioning for faster daily training and road workouts.",
    quantity: 22,
    sold: 6,
    price: 8499,
    priceAfterDiscount: 7999,
    availableColors: ["#111111", "#FFFFFF", "Volt"],
    imageCover:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.7,
    ratingsQuantity: 42,
  },

  {
    title: "Nike Alphafly 3",
    slug: "nike-alphafly-3",
    description:
      "A high-performance racing shoe enginee#DC2626 for speed with responsive cushioning and a lightweight construction.",
    quantity: 10,
    sold: 3,
    price: 14999,
    priceAfterDiscount: 13999,
    availableColors: ["#FFFFFF", "#111111", "Bright #16A34A"],
    imageCover:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.9,
    ratingsQuantity: 31,
  },
];

const productData2 = [
  {
    title: "Adidas Ultraboost 5",
    slug: "adidas-ultraboost-5",
    description:
      "A premium daily running shoe with responsive cushioning and a comfortable, supportive fit for everyday miles.",
    quantity: 40,
    sold: 14,
    price: 7299,
    priceAfterDiscount: 6799,
    availableColors: ["#111111", "#FFFFFF", "#6B7280"],
    imageCover:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1543508282-6319a3e2621f?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.7,
    ratingsQuantity: 112,
  },

  {
    title: "Adidas Adizero Boston 12",
    slug: "adidas-adizero-boston-12",
    description:
      "A lightweight performance running shoe designed for faster training sessions and long-distance road running.",
    quantity: 28,
    sold: 9,
    price: 8499,
    priceAfterDiscount: 7999,
    availableColors: ["#FFFFFF", "#111111", "#DC2626"],
    imageCover:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.8,
    ratingsQuantity: 87,
  },

  {
    title: "Adidas Supernova Rise",
    slug: "adidas-supernova-rise",
    description:
      "A comfortable everyday running shoe offering balanced cushioning and a smooth ride for regular training.",
    quantity: 35,
    sold: 13,
    price: 5999,
    priceAfterDiscount: 5499,
    availableColors: ["#2563EB", "#FFFFFF", "#111111"],
    imageCover:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.5,
    ratingsQuantity: 64,
  },

  {
    title: "Adidas Duramo Speed 2",
    slug: "adidas-duramo-speed-2",
    description:
      "A lightweight and responsive running shoe built for daily workouts, short runs and faster training sessions.",
    quantity: 48,
    sold: 18,
    price: 4999,
    priceAfterDiscount: 4499,
    availableColors: ["#111111", "#16A34A", "#FFFFFF"],
    imageCover:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.4,
    ratingsQuantity: 73,
  },

  {
    title: "Adidas Adistar 3",
    slug: "adidas-adistar-3",
    description:
      "A cushioned long-distance running shoe designed to provide a stable and comfortable ride over extended distances.",
    quantity: 25,
    sold: 6,
    price: 6799,
    priceAfterDiscount: 6299,
    availableColors: ["#6B7280", "#111111", "#EA580C"],
    imageCover:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80",
    ],
    ratingsAverage: 4.6,
    ratingsQuantity: 51,
  },
];

// Insert data into DB
const insertData = async () => {
  try {
    // Create admin user
    const existingAdmin = await User.findOne({
      email: adminUser.email,
    });

    if (!existingAdmin) {
      await User.create(adminUser);
      console.log("Admin user created".green);
    } else {
      console.log("Admin user already exists".yellow);
    }
    // Delete products
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();

    // Create brands
    const brand = await Brand.create(brandData);
    const brand2 = await Brand.create(brandData2);
    // Create category
    const category = await Category.create(categoryData);
    // Attach category + brand to every product
    const products = productData.map((product) => ({
      ...product,
      brand: brand._id,
      category: category._id,
    }));
    const products2 = productData2.map((product) => ({
      ...product,
      brand: brand2._id,
      category: category._id,
    }));

    brandDataArray.map((i) => (
      Brand.create(i)
     ));

     categoryDataArray.map((i) => (
      Category.create(i)
     ));

    // Create products
    await Product.create(products);
    await Product.create(products2);

    console.log("Data Inserted".green.inverse);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();

    console.log("Data Destroyed".red.inverse);

    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
