var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* 1.  Noms des pays européens */

router.get("/pays_euro", (req, res) => {
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "Limit": 100,
        "FilterExpression": "#DDB_regionci89csjth2n = :regionci89csjth2n",
        "ExpressionAttributeNames": {
            "#DDB_regionci89csjth2n": "region"
        },
        "ExpressionAttributeValues": {
            ":regionci89csjth2n": "Europe"
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            /*for (var i in data.Items)
                items.push(data.Items[i]['nom']);*/
            res.contentType = 'application/json';
            res.render('pays_euro', {
                "all": items
            });
        }
    });
});

/*  2. Noms et superficie des pays africains triés par superficie de la 10ème à la 22ème position

/*  3. Toutes les infos disponibles sur un pays donné  */

router.get("/pays_donne", (req, res) => {
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "Limit": 100,
        "FilterExpression": "#DDB_namenusant55yw.#DDB_commonnusant55yw = :namenusant55ywDDBDOTcommonnusant55yw",
        "ExpressionAttributeNames": {
            "#DDB_namenusant55yw": "name",
            "#DDB_commonnusant55yw": "common"
        },
        "ExpressionAttributeValues": {
            ":namenusant55ywDDBDOTcommonnusant55yw": "Panama"
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            var lan = [];
            for (var k in items) {
                if (items.hasOwnProperty(k)) {
                    lan.push(items[k]['languages']);
                }
            }

            var lan_data = [];

            for (let value of Object.values(lan)) {

                Object.keys(value).forEach(key => {

                    lan_data.push(value[key]);
                });
            }
            res.contentType = 'application/json';
            res.render('pays_donne', {
                "pays_donne": items,
                'lan_data': lan_data
            });
        }
    });
});

/* 4. Noms des pays ayant le néerlandais parmi leurs langues officielles */

router.get("/neerlandais", (req, res) => {
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "FilterExpression": "#DDB_languagesfuvn263fagh.#DDB_nldfuvn263fagh = :languagesfuvn263faghDDBDOTnldfuvn263fagh",
        "ExpressionAttributeNames": {
            "#DDB_languagesfuvn263fagh": "languages",
            "#DDB_nldfuvn263fagh": "nld"
        },
        "ExpressionAttributeValues": {
            ":languagesfuvn263faghDDBDOTnldfuvn263fagh": "Dutch"
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            res.contentType = 'application/json';
            res.render('neerlandais', {
                "neerlandais": items,
            });
        }
    });
});

/* 5. Noms des pays qui commencent par une lettre donnée */
router.get("/letter", (req, res) => {
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "FilterExpression": "begins_with(#DDB_namefuvn263fagh.#DDB_commonfuvn263fagh, :namefuvn263faghDDBDOTcommonfuvn263fagh)",
        "ExpressionAttributeNames": {
            "#DDB_namefuvn263fagh": "name",
            "#DDB_commonfuvn263fagh": "common"
        },
        "ExpressionAttributeValues": {
            ":namefuvn263faghDDBDOTcommonfuvn263fagh": "A"
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            res.contentType = 'application/json';
            res.render('letter', {
                "letter": items,
            });
        }
    });
});

/* 6. Noms et superficie des pays ayant une superficie entre 400000 et 500000 km2 */
router.get("/superficie", (req, res) => {
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "FilterExpression": "#DDB_nameq0znhvjn74 > :nameq0znhvjn74 AND #DDB_namep3u0h304ja < :namep3u0h304ja",
        "ExpressionAttributeNames": {
            "#DDB_nameq0znhvjn74": "area",
            "#DDB_namep3u0h304ja": "area"
        },
        "ExpressionAttributeValues": {
            ":nameq0znhvjn74": 400000,
            ":namep3u0h304ja": 500000
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;

            res.contentType = 'application/json';
            res.render('superficie', {
                "superficie": items,
            });
        }

    });
});

/* Ex facultative : 

/* 1. la région dans une liste ("Africa", "Americas", etc)
/* from region*/

router.get("/region_form", (req, res) => {
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "Limit": 100
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            var lan = [];
            for (var k in items) {
                if (items.hasOwnProperty(k)) {
                    lan.push(items[k]['region']);
                }
            }

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
            var unique = lan.filter(onlyUnique);


            res.contentType = 'application/json';
            res.render('region_form', {
                "region_form": unique,
            });
        }
    });
});

/* region action */

router.post('/region_action', function(req, res) {
    var regionName = req.body.region_action;
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "Limit": 100,
        "FilterExpression": "#DDB_regiongwjpuvjkdja = :regiongwjpuvjkdja",
        "ExpressionAttributeNames": {
            "#DDB_regiongwjpuvjkdja": "region"
        },
        "ExpressionAttributeValues": {
            ":regiongwjpuvjkdja": regionName
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            res.contentType = 'application/json';
            res.render('region_action', {
                "region_action": items
            });
        }
    });

});

/* 3. le pays, à taper au clavier ou dans une liste */
/* find country form   */

router.get('/find_country', function(req, res) {
    res.render('find_country', { title: 'Le pays, à taper au clavier ou dans une liste : ' });
});

router.post('/country_found', function(req, res) {
    var countryName = req.body.pays;
    var params = {
        "TableName": "countries",
        "ScanIndexForward": true,
        "Limit": 100,
        "FilterExpression": "#DDB_nameci89csjth2n.#DDB_commonci89csjth2n = :nameci89csjth2nDDBDOTcommonci89csjth2n",
        "ExpressionAttributeNames": {
            "#DDB_nameci89csjth2n": "name",
            "#DDB_commonci89csjth2n": "common"
        },
        "ExpressionAttributeValues": {
            ":nameci89csjth2nDDBDOTcommonci89csjth2n": countryName
        }
    };
    var docClient = req.docClient;
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            var items = data.Items;
            var lan = [];
            for (var k in items) {
                if (items.hasOwnProperty(k)) {
                    lan.push(items[k]['languages']);
                }
            }
            var lan_data = [];
            for (let value of Object.values(lan)) {

                Object.keys(value).forEach(key => {

                    lan_data.push(value[key]);
                });
            }
            res.contentType = 'application/json';
            res.render('country_found', {
                "country_found": items,
                'lan_data': lan_data
            });
        }
    });

});

module.exports = router;