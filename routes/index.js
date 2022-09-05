var express = require("express");
var router = express.Router();

/* GET http://localhost:3000/ */
router.get("/", async function (req, res) {
  const db = req.app.locals.db;

  const sql = `
  SELECT 
  DISTINCT ON (game.title) 
                game.title,
                game.url_slug,
                player.player_name,
                TO_CHAR (player.highscore, '999 999 999 999') AS highscore,
                TO_CHAR (player.highscore_date, 'YYYY-MM-DD') AS highscore_date
        FROM game 
            INNER JOIN player
        ON player.game_id = game.id
        ORDER BY game.title, player.highscore DESC;
`;

  const result = await db.query(sql);

  res.render("index", {
    title: "Highscore",
    player: result.rows,
  });
});

module.exports = router;
