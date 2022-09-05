var express = require('express');
var router = express.Router();

// GET /admin/games
router.get('/', async (req, res) => {

    const db = req.app.locals.db;

    const games = await getGames(db);

    res.render('admin/games/index', {
        title: 'Alla spel',
        games
    });
});

// GET /admin/games/new
router.get('/new', async (req, res) => {

    res.render('admin/games/new', {
        title: 'Nytt spel',
    });
});

// POST /admin/games/new
router.post('/new', async (req, res) => {

    const {
        title,
        description,
        image_url,
        genre,
        release_date
    } = req.body;

    const game = {
        title,
        description,
        image_url,
        genre: capitalizeFirstLetter(genre),
        release_date,
        url_slug: generateURLSlug(title)
    };

    const db = req.app.locals.db;

    await saveGame(game, db);

    res.redirect('/admin/games');
});

const generateURLSlug = (title) =>
         title.replace('-', '')
              .replace(' ', '-')
              .toLowerCase();

const capitalizeFirstLetter = (string) => {
return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

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

module.exports = router;