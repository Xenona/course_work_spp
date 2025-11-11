docker exec -i board-scylla cqlsh <<EOF

DROP KEYSPACE boardy;

CREATE KEYSPACE boardy WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };
use boardy;

CREATE TABLE board_updates (board uuid, timeid uuid, update_data blob, PRIMARY KEY (board, timeid));

CREATE TABLE board_list (
boardid uuid,
name text, 
setting uuid, 
PRIMARY KEY (boardid)
);

CREATE TABLE user (
PRIMARY KEY (user_id),
user_id uuid,
name text,
email text,
password text
);

CREATE TABLE settings (
PRIMARY KEY (settings_id),
settings_id uuid,
theme boolean,
private boolean,
description text
);

 
EOF