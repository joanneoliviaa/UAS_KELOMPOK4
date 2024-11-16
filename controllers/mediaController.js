const Media = require('../model/media'); 

exports.renderTrendsPage = async (req, res) => {
  const season = req.params.season;
  try {
    const media = await Media.getAllBySeason(season); 
    res.render(`trends/${season}/${season}`, { activePage: `/trends/${season}`, media }); 
  } catch (err) {
    console.error("Error fetching media:", err);
    res.status(500).send("Error loading page");
  }
};

exports.getMediaDetail = async (req, res) => {
  const id = req.params.id; 
  try {
    const mediaDetail = await Media.getMediaById(id); 
    if (!mediaDetail) {
      return res.status(404).send('Media not found');
    }
    res.render('trends/detail', { media: mediaDetail });
  } catch (error) {
    res.status(500).send('An error occurred while fetching media detail.');
  }
};
