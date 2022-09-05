----DDL = Data Definition Language för spellistan och spelare
CREATE TABLE game (
    id INTEGER GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(50) NOT NULL,
    description VARCHAR(250) NOT NULL,
    image_url VARCHAR(250) NOT NULL,
    genre VARCHAR(50) NOT NULL,
    release_date smallint NOT NULL,
    url_slug VARCHAR(50) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (url_slug)
);

CREATE TABLE player (
	id INTEGER GENERATED ALWAYS AS IDENTITY,
	player_name VARCHAR(50) NOT NULL,
  highscore INTEGER NOT NULL,
	highscore_date DATE NOT NULL,
  game_id INTEGER,
  FOREIGN KEY (game_id)
    REFERENCES game (id),
	PRIMARY KEY (id)
);
-----DML = Data Manipulation Language för enskilt spel
INSERT INTO game (
    title,
    description,
    image_url,
    genre,
    release_date,
    url_slug  
)VALUES (
  'Tetris',
  'Tetris är ett dator- och TV-spel som går ut på att ordna olika fallande figurer.
   Spelet skapades av ryssen Alekséj Leonídovitj Pázjitnov och gavs ursprungligen ut 1984.',
  'https://via.placeholder.com/320x320.png?text=Tetris',
   'Pussel',
  	1984,
  'tetris'
);

VALUES (
  'Pac-Man',
  'Pac-Man är ursprungligen ett arkadspel skapat av Namcos programmerare Toru Iwatani 1980. 
   Det är ett av världens mest berömda videospel, och har kallats ett av de första i survival horror-genren',
  'https://via.placeholder.com/320x320.png?text=Pac-Man',
   'Labyrintspel/survival horror',
  	1980,
  'pac-man'
);

 VALUES (
  'Donkey Kong',
  'Donkey Kong är ett arkadspel av plattfomstyp från år 1981, 
   tillverkat av Nintendo, som senare också släpptes som Game & Watch och som TV-spel till NES.',
  'https://via.placeholder.com/320x320.png?text=Donkey-Kong',
   'Plattformsspel',
  	1981,
  'donkey-kong'
);

 VALUES (
  'Cabal',
  'Cabal is a 1988 arcade shooter video game originally developed by TAD Corporation and published in Japan by Taito,
   in North America by Fabtek[5] and in Europe by Capcom',
  'https://via.placeholder.com/320x320.png?text=Cabal',
   'Shooting gallery',
  	1988,
   'cabal'
);

 VALUES (
  'Asteroids',
  'Asteroids är ett arkadspel från Atari år 1979. Året efter (1980) släpptes även Asteroids DeLuxe, 
   en något mer avancerad variant och ytterligare något senare samma år släpptes 
   Space duel som tillät två spelare samtidigt och även hade färggrafik. Alla tre spelen bygger på vektorgrafik.',
  'https://via.placeholder.com/320x320.png?text=Asteroids',
   'Shoot em up',
  	1979,
   'asteroids'
);

-----DML = Data Manipulation Language för enskilt spelare

INSERT INTO player (
    player_name,
    highscore,
    highscore_date,
    game_id,
)VALUES 
      ('Buse','2,340,240','2022-05-07','1'),
      ('William JR','3,333,360','1999-02-16','2'),
      ('Lakeman','1,260,700','2020-06-15','3'),
      ('Guggensulli','10,02,23','2016-10-09','4'),
      ('Scott Safran','40,101,910','1982-02-06','5')