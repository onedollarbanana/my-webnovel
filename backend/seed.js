const bcrypt = require('bcrypt');
const { sequelize } = require('./config/database');
const User = require('./models/user');
const Fiction = require('./models/fiction');
const Chapter = require('./models/chapter');
const Comment = require('./models/comment');

async function run() {
  await sequelize.sync({ force: true });

  const author1 = await User.create({
    username: 'author1',
    passwordHash: await bcrypt.hash('password1', 10),
  });

  const author2 = await User.create({
    username: 'author2',
    passwordHash: await bcrypt.hash('password2', 10),
  });

  const fiction1 = await Fiction.create({
    title: 'Epic Adventure',
    description: 'An epic adventure novel.',
    genre: 'Fantasy',
    authorId: author1.id,
  });

  const fiction2 = await Fiction.create({
    title: 'Sci-fi Saga',
    description: 'A saga set in space.',
    genre: 'Sci-fi',
    authorId: author2.id,
  });

  const chapter1 = await Chapter.create({
    title: 'Chapter 1',
    content: 'Once upon a time...',
    fictionId: fiction1.id,
    authorId: author1.id,
  });

  const chapter2 = await Chapter.create({
    title: 'Chapter 1',
    content: 'In a galaxy far far away...',
    fictionId: fiction2.id,
    authorId: author2.id,
  });

  await Comment.create({
    content: 'Great start!',
    chapterId: chapter1.id,
    authorId: author2.id,
  });

  await Comment.create({
    content: 'Can\'t wait for more.',
    chapterId: chapter1.id,
    authorId: author1.id,
  });

  console.log('Database seeded successfully');
  await sequelize.close();
}

run().catch((err) => {
  console.error(err);
  sequelize.close();
});
