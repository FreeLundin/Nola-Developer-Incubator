-- Demo seed data for leaderboard
INSERT INTO leaderboard (name, score, ts) VALUES
('King Rex', 120, extract(epoch from now())::bigint),
('Queen Zulu', 95, extract(epoch from now())::bigint),
('Lil Jester', 80, extract(epoch from now())::bigint);

-- Demo session
INSERT INTO sessions (payload) VALUES
('{"player":"guest","state":{"score":5}}');

