const pool = require('../model/db');

const Media = {
  getAllBySeason: async (season) => {
    try {
      const result = await pool.query(
        'SELECT * FROM media_content WHERE season = $1',
        [season]
      );
      return result.rows;
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
};

module.exports = Media;
