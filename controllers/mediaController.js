const Media = require('../model/media');
const validSeasons = ['summer', 'winter', 'spring', 'autumn'];

exports.renderTrendsPage = async (req, res) => {
  const season = req.params.season.toLowerCase();

  if (!validSeasons.includes(season)) {
    return res.status(400).send('Invalid season');
  }

  try {
    const media = await Media.getAllBySeason(season); 
    res.render(`trends/${season}/${season}`, { activePage: `/trends/${season}`, media });
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).send("Error loading page");
  }
};

exports.getMediaDetail = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).send('Invalid media ID');
  }

  try {
    const mediaDetail = await Media.getMediaById(id);
    if (!mediaDetail) {
      return res.status(404).send('Media not found');
    }
    res.render('trends/details', { media: mediaDetail });
  } catch (error) {
    console.error("Error fetching media detail:", error);
    res.status(500).send('An error occurred while fetching media detail.');
  }
};

// Get comments for a specific media
exports.getComments = (req, res) => {
  const mediaId = req.params.id;

  Comment.getByMediaId(mediaId, (err, comments) => {
    if (err) return res.status(500).json({ message: 'Error fetching comments' });
    res.json(comments);
  });
};

// Add a new comment
exports.addComment = (req, res) => {
  const { text } = req.body;
  const mediaId = req.params.id;
  const userId = req.session.userId;

  if (!userId) return res.status(401).json({ message: 'User not logged in' });

  const commentData = { text, userId, mediaId };

  Comment.create(commentData, (err, newComment) => {
    if (err) return res.status(500).json({ message: 'Error saving comment' });
    res.status(201).json(newComment);
  });
};

