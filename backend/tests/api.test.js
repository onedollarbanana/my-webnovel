process.env.JWT_SECRET = 'testsecret';
const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth endpoints', () => {
  test('signup and login return tokens', async () => {
    const signup = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'testuser', password: 'password' });
    expect(signup.status).toBe(200);
    expect(signup.body.token).toBeDefined();

    const login = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password' });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  test('signup as reader stores role', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'reader1', password: 'pass' });
    expect(res.status).toBe(200);
    expect(res.body.role).toBe('reader');
  });

  test('profile endpoints return and update user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'profile', password: 'pass' });
    const token = res.body.token;

    const me = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.username).toBe('profile');

    const upd = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'newprofile' });
    expect(upd.status).toBe(200);
    expect(upd.body.username).toBe('newprofile');
  });
});

describe('Fiction, chapters and comments', () => {
  let token;
  let fictionId;
  let chapterId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'author1', password: 'pass', role: 'author' });
    token = res.body.token;
  });

  test('create fiction', async () => {
    const res = await request(app)
      .post('/api/fictions')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'Fic')
      .field('description', 'Desc')
      .field('genre', 'Fantasy');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Fic');
    fictionId = res.body.id;
  });

  test('create chapter and list', async () => {
    const create = await request(app)
      .post(`/api/chapters/${fictionId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Ch1', content: 'Hello' });
    expect(create.status).toBe(200);
    chapterId = create.body.id;

    const list = await request(app).get(`/api/chapters/${fictionId}`);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body.length).toBe(1);
  });

  test('post comment', async () => {
    const post = await request(app)
      .post(`/api/comments/${chapterId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Nice work' });
    expect(post.status).toBe(200);

    const list = await request(app).get(`/api/comments/${chapterId}`);
    expect(list.body.length).toBe(1);
    expect(list.body[0].content).toBe('Nice work');
  });
});

describe('Ratings', () => {
  let authorToken;
  let userToken;
  let fictionId;

  beforeAll(async () => {
    const author = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'rateauthor', password: 'pass', role: 'author' });
    authorToken = author.body.token;
    const fiction = await request(app)
      .post('/api/fictions')
      .set('Authorization', `Bearer ${authorToken}`)
      .field('title', 'Rate Me')
      .field('description', 'd')
      .field('genre', 'g');
    fictionId = fiction.body.id;

    const user = await request(app)
      .post('/api/auth/signup')
      .send({ username: 'rater', password: 'pass' });
    userToken = user.body.token;
  });

  test('submit and get rating average', async () => {
    const res = await request(app)
      .post(`/api/ratings/${fictionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ value: 5 });
    expect(res.status).toBe(200);

    const avg = await request(app).get(`/api/ratings/${fictionId}`);
    expect(avg.status).toBe(200);
    expect(avg.body.average).toBeCloseTo(5);
  });
});
