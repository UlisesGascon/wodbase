var request = require('request');
var Firebase = require('firebase');
var chalk = require('chalk');
var _ = require('lodash');

var boxToFirebase = {

    options: {
        wodbasedb: 'https://wodbase.firebaseio.com/',
        boxListUrl: {
            // url: 'https://map.crossfit.com/getAllAffiliates.php',
            url: 'https://wodbase.firebaseapp.com/crossfitCenters.json',
            json: true
        },
        boxItemUrl: function(id) {
            return {
                url: 'https://map.crossfit.com/getAffiliateInfo?aid=' + id,
                json: true
            }
        }
    },
    addBox: function(db, options) {

        var db = db || new Firebase(this.options.wodbasedb);
        var options = options || this.options.boxListUrl;

        var callRequest = function(error, response, centersList) {
            if (!error && response.statusCode == 200) {

                var boxesPath = db.child('crossfitCenters');
                var counter = 0;

                var onComplete = function(error) {
                    if (error) {
                        console.log(chalk.red('✖ ') + ' Error');
                    } else {
                        console.log(chalk.green('✔ ') + ' ' + chalk.italic(counter) + ' - ' + centersList[i][2] + ' was added. '+ chalk.blue('(ID: ' + centersList[i][3] + ')'))
                    }
                };

                for (i = 0; i < centersList.length; i++) {
                    var name = _.camelCase(centersList[i][2]);
                    var boxId = centersList[i][3];
                    counter++;

                    // push the info to Firebase
                    boxesPath.child(name).update({
                        _id: Number(centersList[i][3]),
                        name: centersList[i][2],
                        lat: centersList[i][0],
                        long: centersList[i][1]
                    }, onComplete());
                }

                // kill the nodejs process
                // process.exit();
            }
        };

        // call the 'api' with the crossfit box list
        request(options, callRequest);
    },
    addBoxInfo: function() {
        var db = new Firebase('https://wodbase.firebaseio.com/crossfitCenters/');

        db.once('value', function(snapshot) {

            // console.log(snapshot.val());

            // var keys = Object.keys(snapshot.val());

            // var count = 0;

            var key = childSnapshot.key();
            var val = childSnapshot.val();
            var wodId = val._id;
            var options = {
                url: 'https://map.crossfit.com/getAffiliateInfo?aid=' + wodId,
                json: true
            };

            boxToFirebase.addSingleInfo(options, db, key);

        });
    },
    addSingleInfo: function(options, db, key, callback) {

        request(options, function callback(error, response, data) {
            if (!error && response.statusCode == 200) {

                db.child(key).update({
                    info: {
                        web: data.website,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        country: data.country,
                        phone: data.phone
                    }
                }, console.log(data.name + ' was added.'));

            } else {
                console.log('fallo del sistema');
            }
        });

    }
};

boxToFirebase.addBox();
boxToFirebase.addBoxInfo();
