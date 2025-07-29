const Fiction = require('../models/fiction');
const { Op } = require('sequelize');

exports.listFictions = async (req, res) => {
  const where = {};
  if (req.query.search) {
    where.title = { [Op.iLike]: `%${req.query.search}%` };
  }
  if (req.query.genre) {
    where.genre = req.query.genre;
  }
  const order = [];
  if (req.query.sort === 'popular') {
    order.push(['views', 'DESC']);
  } else {
    order.push(['updatedAt', 'DESC']);
  }
  const fictions = await Fiction.findAll({ where, order });
  res.json(fictions);
};

exports.createFiction = async (req, res) => {
  try {
    const { title, description, genre } = req.body;
    const coverImage = req.file ? `/uploads/${req.file.filename}` : null;
    const fiction = await Fiction.create({
      title,
      description,
      genre,
      coverImage,
      authorId: req.user.id,
    });
    res.json(fiction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getFiction = async (req, res) => {
  const fiction = await Fiction.findByPk(req.params.id);
  if (!fiction) return res.status(404).json({ error: 'Not found' });
  await fiction.increment('views');
  res.json(fiction);
};

exports.updateFiction = async (req, res) => {
  const fiction = await Fiction.findByPk(req.params.id);
  if (!fiction || fiction.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await fiction.update(req.body);
  res.json(fiction);
};

exports.deleteFiction = async (req, res) => {
  const fiction = await Fiction.findByPk(req.params.id);
  if (!fiction || fiction.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await fiction.destroy();
  res.json({ success: true });
};
