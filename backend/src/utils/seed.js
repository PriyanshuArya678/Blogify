require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Blog = require('../models/blog.model');
const Comment = require('../models/comment.model');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data...\n');

    // Create test users (passwords will be hashed automatically by pre-save hook)
    const user1 = new User({
      username: 'john_doe',
      email: 'user1@example.com',
      password: 'password123', // Will be hashed automatically
      followers: [],
      following: [],
    });

    const user2 = new User({
      username: 'jane_smith',
      email: 'user2@example.com',
      password: 'password123', // Will be hashed automatically
      followers: [],
      following: [],
    });

    await user1.save();
    await user2.save();
    console.log('✅ Created Users:');
    console.log(`   User 1 ID: ${user1._id}`);
    console.log(`   User 2 ID: ${user2._id}\n`);

    // Create blog posts
    const blog1 = new Blog({
      title: 'Getting Started with Node.js',
      content: 'Node.js is a powerful JavaScript runtime that allows you to build scalable network applications. In this blog post, we will explore the basics of Node.js and how to get started with your first application.',
      author: user1._id,
      categories: ['Technology', 'Education'],
      tags: ['nodejs', 'javascript', 'programming', 'tutorial', 'beginner'],
      media: ['nodejs-intro.jpg'],
      likesCount: 0,
      commentsCount: 0,
    });

    const blog2 = new Blog({
      title: 'The Art of Cooking Italian Cuisine',
      content: 'Italian cuisine is known for its simplicity and focus on fresh, high-quality ingredients. In this post, we will learn about traditional Italian cooking techniques and some classic recipes that you can try at home.',
      author: user2._id,
      categories: ['Food', 'Lifestyle'],
      tags: ['cooking', 'food', 'guide', 'tips'],
      media: ['italian-cuisine.jpg', 'pasta-recipe.jpg'],
      likesCount: 0,
      commentsCount: 0,
    });

    await blog1.save();
    await blog2.save();
    console.log('✅ Created Blog Posts:');
    console.log(`   Blog 1 ID: ${blog1._id}`);
    console.log(`   Blog 2 ID: ${blog2._id}\n`);

    // Create comments
    const comment1 = new Comment({
      content: 'Great introduction to Node.js! Looking forward to more tutorials.',
      author: user2._id,
      blog: blog1._id,
      parentComment: null,
    });

    await comment1.save();

    // Update blog comment count
    blog1.commentsCount = 1;
    await blog1.save();

    console.log('✅ Created Comments:');
    console.log(`   Comment 1 ID: ${comment1._id}\n`);

    // Print summary
    console.log('📊 Seed Data Summary:');
    console.log('   Users: 2');
    console.log('   Blogs: 2');
    console.log('   Comments: 1');
    console.log('\n✅ Seeding completed successfully!');

    // Print IDs and credentials for testing
    console.log('\n📋 IDs for Testing:');
    console.log(`   User 1 ID: ${user1._id}`);
    console.log(`   User 2 ID: ${user2._id}`);
    console.log(`   Blog 1 ID: ${blog1._id}`);
    console.log(`   Blog 2 ID: ${blog2._id}`);
    console.log(`   Comment 1 ID: ${comment1._id}`);
    console.log('\n🔐 Test Credentials:');
    console.log('   User 1: user1@example.com / password123');
    console.log('   User 2: user2@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(() => {
  seedData().then(() => {
    mongoose.connection.close();
  });
});


