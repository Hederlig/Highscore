var express = require("express");
var router = express.Router();

/*GET http://localhost:3000/games/urlSlug */
router.get("/:urlSlug", async function (req, res) {
  const urlSlug = req.params.urlSlug;

  const db = req.app.locals.db;
  
  const sql = `
            SELECT 
                game.id,
                game.title,
                game.description,
                game.image_url,
                game.genre,
                game.release_date,
                game.url_slug,
                player.player_name,
               TO_CHAR (player.highscore, '999 999 999 999') AS highscore,
                TO_CHAR (player.highscore_date, 'YYYY-MM-DD') AS highscore_date
          FROM game 
              INNER JOIN player
                  ON player.game_id = game.id
                  WHERE game.url_slug = $1
             ORDER BY player.highscore DESC
             LIMIT 10;
  `;

  const result = await db.query(sql, [urlSlug]);

  const { 
    title, 
    genre, 
    description, 
    release_date, 
    image_url, 
    url_slug 
    } = result.rows[0];

  const games = {
    title: title,
    genre: genre,
    description: description,
    release_date: release_date,
    image_url: image_url,
    url_slug: url_slug
  };

  const player = result.rows.map((player) => ({
    player: player.player_name,
    highscore: player.highscore,
    highscore_date: player.highscore_date
    
  }));
 
  res.render("games/details", {
    title: games.title,
    games,
    player
  });
});

module.exports = router;