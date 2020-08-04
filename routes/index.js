var express = require('express');
var router = express.Router();
const db = require('../db/index');
/* GET home page. */

async function callback_Original(index) {
  return new Promise((resolve, reject) => {
    db.query(`SELECT count(*) as "ProcessedCount" FROM public.nlprecords
      where created_at < now()::date and created_at > now()::date - INTERVAL \' `+ index + `DAYS\'`,
      [], (err, res) => {
        if (err) {
          throw new Error(err)
        } else {
          resolve({
            Day: index,
            ProcessedCount: res.rows[0].ProcessedCount
          });
        }
      })

  });
}
async function get_array(value) {
  var array_of_promises = [], array_of_results = []
  value.forEach(item => {
    array_of_promises.push(callback_Original(item));
  });
  array_of_results = await Promise.all(array_of_promises);
  console.log(array_of_results)// prints populated array
  return array_of_results;
}
router.get('/', async (req, res, next) => {
  let apistats = []

  db.query(`SELECT * FROM public.apistats ORDER BY id`,
    [], (err, result) => {
      if (err) {
        console.log(err.stack)
        throw new Error(err)
      } else {
        console.log(result.rows)
        apistats = result.rows;
        var arrayPromise = get_array([1, 2, 3, 4, 5, 6, 7]);
        arrayPromise.then((results) => {
          res.render('index', { title: 'Express', apistats: apistats, counts: results });
        });
      }
    })
});

module.exports = router;
