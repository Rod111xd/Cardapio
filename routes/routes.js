
const express = require('express');

const { fetchItems, makeMenu, lastMenu } = require('../controllers/items');

const router = express.Router();

router.get('/items', fetchItems);

router.post('/menu', makeMenu);

router.get('/last', lastMenu);

// will match any other path
router.use('/', (req, res, next) => {
    res.status(404).json({error : "page not found"});
});

module.exports = router
//export default router;