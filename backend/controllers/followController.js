const Follow = require('../models/follow');
const Fiction = require('../models/fiction');

exports.followFiction = async (req, res) => {
  const { fictionId } = req.params;
  const [follow] = await Follow.findOrCreate({
    where: { userId: req.user.id, fictionId },
  });
  res.json(follow);
};

exports.unfollowFiction = async (req, res) => {
  const { fictionId } = req.params;
  await Follow.destroy({ where: { userId: req.user.id, fictionId } });
  res.json({ success: true });
};

exports.listFollows = async (req, res) => {
  const follows = await Follow.findAll({
    where: { userId: req.user.id },
    include: Fiction,
  });
  res.json(follows.map(f => f.Fiction));
};
