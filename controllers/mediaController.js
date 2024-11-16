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
