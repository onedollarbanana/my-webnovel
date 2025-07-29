const Comment = require('../models/comment');

exports.listComments = async (req, res) => {
  const comments = await Comment.findAll({
    where: { chapterId: req.params.chapterId },
    order: [['createdAt', 'ASC']],
  });
  res.json(comments);
};

exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      ...req.body,
      chapterId: req.params.chapterId,
      authorId: req.user.id,
    });
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
