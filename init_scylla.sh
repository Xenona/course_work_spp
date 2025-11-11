docker exec -i board-scylla cqlsh <<EOF

DROP KEYSPACE $1;

CREATE KEYSPACE $1 WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 1 };
use boardy;

CREATE TABLE board_updates (board uuid, timeid uuid, update_data blob, PRIMARY KEY (board, timeid));
   
EOF