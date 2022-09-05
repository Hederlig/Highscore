var express = require("express");
var router = express.Router();

// GET /api/games

/**
 *  @swagger
 *  /api/games:
 *    get:
 *      summary: Get all games
 *      description: Get all games
 *      tags: [Game]
 *      parameters:
 *        - title: title
 *          in: query
 *          description: Game title
 *          required: false
 *      responses:
 *        200:
 *          description: Returns list of games
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Game'
 *        404:
 *          description: Couldn't fetch games
 */

router.get("/", async (req, res) => {

    const  { title }  = req.query;

    const db = req.app.locals.db;

    const games = title
    ? await searchGames(title, db)
    : await getGames(db);
  
    res.json(games);
  });

  async function searchGames(title, db){

    const sql = `
            SELECT id,
                title,
                genre,
                release_date,
                url_slug
        FROM game
        WHERE title ILIKE '%' || $1 || '%'
    `

    const result = await db.query(sql, [title]);

    return result.rows;
  }  

  async function getGames(db) {

    const sql = `
        SELECT id,
               title,
               genre,
               release_date,
               url_slug
          FROM game
    `;

    const result = await db.query(sql);

    return result.rows;
}
  // GET /api/games/{urlSlug} Hämta ett spel

  /**
 *  @swagger
 *  /api/games/{urlSlug}:
 *    get:
 *      summary: Get game
 *      description: Get game
 *      tags: [Game]
 *      parameters:
 *        - name: urlSlug
 *          in: path
 *          description: Game URL slug
 *          required: true
 *      responses:
 *        200:
 *          description: Returns game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Game'
 *        404:
 *          description: Game not found
 */

  router.get("/:urlSlug", async (req, res) => {

    const { urlSlug } = req.params;

    const db = req.app.locals.db;
    const game  = await getGame(urlSlug, db);
  
    if (!game ){
        // sätter 404 not found
        res.status(404).send();
        return;
    }

    // sätter 200 ok
    res.json(game);
    
  });

  async function getGame(urlSlug, db){

      const sql = `
      SELECT id,
             title,
             genre,
             release_date,
             url_slug
        FROM game
        WHERE url_slug = $1
      `;

      const result = await db.query(sql, [ urlSlug ]);

      const game = result.rows.length > 0
                    ? result.rows[0]
                    : undefined;
         return game;     
  }

// POST /api/games Lägg till spel

/**
 *  @swagger
 *  /api/games:
 *    post:
 *      summary: Create new game
 *      description: Create new game
 *      tags: [Game]
 *      consumes:
 *        - application/json
 *      requestBody:
 *        description: Game details
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              $ref: '#/components/schemas/NewGame'
 *      produces:
 *        - application/json
 *      responses:
 *        201:
 *          description: Returns game
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                $ref: '#/components/schemas/Game'
 *        400:
 *          description: Invalid product
 */

router.post("/", async (req, res) => {
    const db = req.app.locals.db;
  
    const { title, genre, description, release_date, image_url } = req.body;
  
    if (!title || !genre || !description || !image_url || !release_date) {
      res.status(400).send();
      return;
    }
  
    const game = {
      title,
      genre,
      description,
      release_date,
      image_url,
      url_slug: generateURLSlug(title),
    };
  
    game.id = await saveGame(game, db);
  
    res.location(`/api/games/${game.urlSlug}`);
  
    res.status(201).send(game);
  });

  async function saveGame(game, db) {

    const sql = `
        INSERT INTO game (
            title,
            description,
            image_url,
            genre,
            release_date,
            url_slug
        ) VALUES ($1, $2, $3, $4, $5, $6)
    `;

    await db.query(sql, [
        game.title,
        game.description,
        game.image_url,
        game.genre,
        game.release_date,
        game.url_slug
    ]);
}
const generateURLSlug = (title) =>
         title.replace('-', '')
              .replace(' ', '-')
              .toLowerCase();


// DELET Ta bort spel

/**
 *  @swagger
 *  /api/games/{id}:
 *    delete:
 *      summary: Delete game
 *      description: Delete game
 *      tags: [Game]
 *      parameters:
 *        - name: id
 *          in: path
 *          description: Game id
 *          required: true
 *      responses:
 *        204:
 *          description: Game deleted
 *        401:
 *          description: Not logged in
 *        403:
 *          description: Not allowed
 */

router.delete("/:urlSlug", async (req, res) => {
    const db = req.app.locals.db;
  
    const  { urlSlug }  = req.params;
  
    await deleteGame(urlSlug, db);
  
    res.status(204).send();
  });

  const deleteGame = async (gameId, db) => {
    const sql = `
      DELETE FROM game
        WHERE url_slug = $1
    `;
  
    await db.query(sql, [gameId]);
  };

  // GET highscore via spel

  /**
 *  @swagger
 *  /api/games/{urlSlug}/highscores:
 *    get:
 *      summary: Get all highscores for game
 *      description: Get all highscores for game
 *      tags: [Game]
 *      parameters:
 *        - name: urlSlug
 *          in: path
 *          description: Game URL slug
 *          required: true
 *      responses:
 *        200:
 *          description: Returns highscores
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Highscores'
 *        404:
 *          description: Highscores not found
 */

  router.get("/:urlSlug/highscores", async (req, res) => {
      
    const { urlSlug } = req.params;

    const db = req.app.locals.db;
    const scores  = await getGameScore(urlSlug, db);
  
    res.json(scores);
  });
  
  const getGameScore = async (urlSlug, db) => {
    const sql = `
              SELECT 
                  game.title,
                  player.player_name,
                  TO_CHAR (player.highscore, '999 999 999 999') AS highscore,
                  TO_CHAR (player.highscore_date, 'YYYY-MM-DD') AS highscore_date
          FROM game 
              INNER JOIN player
              ON player.game_id = game.id
          WHERE game.url_slug = $1
          ORDER BY player.highscore DESC

  `;
  
  const result = await db.query(sql, [ urlSlug ]);

     return result.rows;
         
  }

  /**
 *  @swagger
 *  components:
 *    schemas:
 *      Game:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *            description: Game id
 *          title:
 *            type: string
 *            description: Game title
 *          genre:
 *            type: string
 *            description: Game genre
 *          description:
 *            type: string
 *            description: Game description
 *          imageUrl:
 *            type: string
 *            description: Game image
 *          releaseDate:
 *            type: string
 *            description: Game release date
 *          urlSlug:
 *            type: string
 *            description: Game URL slug
 *      NewGame:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            description: Game title
 *          genre:
 *            type: string
 *            description: Game genre
 *          description:
 *            type: string
 *            description: Game description
 *          imageUrl:
 *            type: string
 *            description: Game image URL
 *          releaseDate:
 *            type: string
 *            description: Game release date
 *      Highscores:
 *        type: object
 *        properties:
 *          title:
 *            type: string
 *            description: Game title
 *          urlSlug:
 *            type: string
 *            description: Game URL slug
 *          player:
 *            type: string
 *            description: Player
 *          highscore:
 *            type: integer
 *            description: Player highscore
 *          highscoreDate:
 *            type: string
 *            description: Highscore date
 */


  module.exports = router;