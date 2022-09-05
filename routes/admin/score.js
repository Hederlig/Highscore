var express = require('express');
var router = express.Router();

// GET /admin/score
router.get('/', async (req, res) => {

    res.render('./admin/score/index', {
        title: 'Administration'
    });
});

// GET /admin/score/new
router.get('/new', async (req, res) => {

    const db = req.app.locals.db;

    const sql = `
        SELECT game.id,
               game.title
          FROM game
    `;

    const result = await db.query(sql);

    const games = result.rows;

    res.render('./admin/score/new', {
        title: 'Nytt Highscore',
        games
    });
});

// POST /admin/score/new
router.post('/new', async (req, res) => {

    const {
        player_name,
        highscore_date,
        highscore,
        game_id
    } = req.body;

    const newhighscore = {
        player_name,
        highscore_date,
        highscore,
        game_id
    };
    

    const db = req.app.locals.db;

    await saveNewhighscore(newhighscore, db),

    res.redirect('/admin/games');
});


const saveNewhighscore = async (player, db) => {

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