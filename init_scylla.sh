docker exec -i board-scylla cqlsh <<EOF

DROP KEYSPACE $1;

CREATE KEYSPACE $1 WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };
use $1;

CREATE TABLE board_updates (board uuid, timeid uuid, update_data blob, PRIMARY KEY (board, timeid));

CREATE TABLE board_list (boardid uuid, name text, PRIMARY KEY (boardid));

EOF