const express = require('express');
const { checkDomain } = require('../middleware/domain');
const router = express.Router();
const blogController = require('../controllers/blogController');
const uploadSingleFile = require('../middleware/upload');


// need to add authenticateToken after front end integration ==> Biggie

// GET BİLEŞENLER
router.get('/blogView', checkDomain, blogController.view);
router.get('/blogList', checkDomain, blogController.list);
router.get('/blog/latest',checkDomain, blogController.latest);
router.get('/blog/latestFeatured',checkDomain, blogController.getLatestFeatured);


//POST BİLEŞENLER
router.post('/blogCreate', checkDomain,uploadSingleFile, blogController.create);
router.post('/blogEdit/:slug', checkDomain,uploadSingleFile, blogController.edit);

//PUT BİLEŞENLER


module.exports = router;