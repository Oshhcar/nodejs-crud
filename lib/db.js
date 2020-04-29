//”cassandra-driver” is in the node_modules folder. Redirect if necessary.
var cassandra = require('cassandra-driver');
//Replace Username and Password with your cluster settings
var authProvider = new cassandra.auth.PlainTextAuthProvider('cassandra', 'cassandra');
//Replace PublicIP with the IP addresses of your clusters
var client = new cassandra.Client({ contactPoints: ['127.0.0.1'], authProvider: authProvider, keyspace: 'tickets', localDataCenter: 'datacenter1' });

module.exports = client;