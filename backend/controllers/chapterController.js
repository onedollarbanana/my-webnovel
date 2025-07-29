const Chapter = require('../models/chapter');

exports.listChapters = async (req, res) => {
  const chapters = await Chapter.findAll({
    where: { fictionId: req.params.fictionId },
    order: [['createdAt', 'ASC']],
  });
  res.json(chapters);
};

exports.createChapter = async (req, res) => {
  try {
    const chapter = await Chapter.create({
      ...req.body,
      fictionId: req.params.fictionId,
      authorId: req.user.id,
    });
    res.json(chapter);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getChapter = async (req, res) => {
  const chapter = await Chapter.findByPk(req.params.id);
  res.json(chapter);
};

exports.updateChapter = async (req, res) => {
  const chapter = await Chapter.findByPk(req.params.id);
  if (!chapter || chapter.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await chapter.update(req.body);
  res.json(chapter);
};

exports.deleteChapter = async (req, res) => {
  const chapter = await Chapter.findByPk(req.params.id);
  if (!chapter || chapter.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  await chapter.destroy();
  res.json({ success: true });
};
