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
}