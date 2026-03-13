import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    children: [
      { name: 'Smartphones', slug: 'smartphones', description: 'Mobile phones and accessories' },
      { name: 'Laptops', slug: 'laptops', description: 'Notebook computers and accessories' },
      { name: 'Tablets', slug: 'tablets', description: 'Tablet computers and accessories' },
      { name: 'Audio', slug: 'audio', description: 'Headphones, speakers, and audio equipment' },
    ],
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Clothing and fashion accessories',
    children: [
      { name: 'Men\'s Clothing', slug: 'mens-clothing', description: 'Clothing for men' },
      { name: 'Women\'s Clothing', slug: 'womens-clothing', description: 'Clothing for women' },
      { name: 'Shoes', slug: 'shoes', description: 'Footwear for all genders' },
      { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories and jewelry' },
    ],
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home appliances and kitchenware',
    children: [
      { name: 'Kitchen Appliances', slug: 'kitchen-appliances', description: 'Cooking and food preparation appliances' },
      { name: 'Home Decor', slug: 'home-decor', description: 'Decorative items for home' },
      { name: 'Furniture', slug: 'furniture', description: 'Home and office furniture' },
      { name: 'Bedding', slug: 'bedding', description: 'Bed sheets, pillows, and bedding accessories' },
    ],
  },
  {
    name: 'Books & Media',
    slug: 'books-media',
    description: 'Books, movies, music, and games',
    children: [
      { name: 'Fiction Books', slug: 'fiction-books', description: 'Novels and story books' },
      { name: 'Non-Fiction Books', slug: 'non-fiction-books', description: 'Educational and reference books' },
      { name: 'Movies & TV', slug: 'movies-tv', description: 'Movies and TV shows' },
      { name: 'Video Games', slug: 'video-games', description: 'Gaming software and accessories' },
    ],
  },
];

async function seed() {
  console.log('🌱 Starting database seed...');

  for (const category of categories) {
    console.log(`📁 Creating category: ${category.name}`);
    
    const parentCategory = await prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });

    for (const child of category.children) {
      console.log(`  📂 Creating subcategory: ${child.name}`);
      
      await prisma.category.create({
        data: {
          name: child.name,
          slug: child.slug,
          description: child.description,
          parentId: parentCategory.id,
        },
      });
    }
  }

  console.log('✅ Database seed completed successfully!');
}

seed()
  .catch((error) => {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
