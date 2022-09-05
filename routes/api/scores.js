var express = require("express");
var router = express.Router();

// GET /api/highscore 

// GET /api/scores/highscores
/**
 *  @swagger
 *  /api/scores/highscores:
 *    get:
 *      summary: Get top highscores
 *      description: Get top highscores
 *      tags: [Score]
 *      responses:
 *        200:
 *          description: Returns highscores
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Score'
 *        404:
 *          description: Highscores not found
 */

router.get("/highscores", async (req, res) => {
      
    const db = req.app.locals.db;
  
    const scores = await getGameScore(db);
  
    res.json(scores);
  });
  
  const getGameScore = async (db) => {
    const sql = `
              SELECT 
                  game.title,
                  player.player_name,
                  TO_CHAR (player.highscore, '999 999 999 999') AS highscore,
                  TO_CHAR (player.highscore_date, 'YYYY-MM-DD') AS highscore_date
          FROM game 
              INNER JOIN player
          ON player.game_id = game.id
          

  `;
  
  const result = await db.query(sql);
  return result.rows;
  }

  // POST skapa nytt highscore

  /**
 *  @swagger
 *  /api/scores:
 *    post:
 *      summary: Add new score
 *      description: Add new score
 *      tags: [Score]
 *      consumes:
 *        - application/json
 *      requestBody:
 *        description: Score details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/NewScore'
 *      produces:
 *        - application/json
 *      responses:
 *        201:
 *          description: Returns score
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Score'
 *        400:
 *          description: Invalid score
 */

  router.post("/", async (req, res) => {

    const db = req.app.locals.db;

    const {
        game_id,
        player_name,
        highscore,
        highscore_date,
      } = req.body;

      if (!player_name || !highscore|| !highscore_date || !game_id) {
        res.status(400).send();
        return;
      }

    const newScore = {
        game_id,
        player_name,
        highscore,
        highscore_date,
    }
      await saveNewhighscore(newScore, db),

      res.location(`/api/scores/${newScore}`);
    res.status(201).send(newScore);
  });

  async function saveNewhighscore(player, db){

    const sql = `
        INSERT INTO player (
            player_name,
            highscore_date,
            highscore,
            game_id
        ) VALUES ($1, $2, $3, $4)
    `;

        await db.query(sql, [
        player.player_name,
        player.highscore_date,
        player.highscore,
        player.game_id
    ]);

    
}

  module.exports = router;
