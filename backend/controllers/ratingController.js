const Rating = require('../models/rating');

exports.submitRating = async (req, res) => {
  const { fictionId } = req.params;
  const { value } = req.body;
  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ error: 'Invalid rating' });
  }
  const [rating] = await Rating.findOrCreate({
    where: { userId: req.user.id, fictionId },
    defaults: { value },
  });
  if (!rating.isNewRecord) {
    await rating.update({ value });
  }
  res.json(rating);
};

exports.getAverage = async (req, res) => {
  const { fictionId } = req.params;
  const result = await Rating.findAll({
    where: { fictionId },
    attributes: [[Rating.sequelize.fn('AVG', Rating.sequelize.col('value')), 'avg']],
  });
  const avg = parseFloat(result[0].get('avg')) || 0;
  res.json({ average: avg });
};
