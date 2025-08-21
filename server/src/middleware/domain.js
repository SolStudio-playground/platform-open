const allowedDomains = ["localhost", 'app.solstudio.so', 'solstudio.so','80.85.141.88','www.solstudio.so','www.app.solstudio.so'];

function checkDomain(req, res, next) {
    const referer = req.headers.referer || req.headers.origin;
    const secretToken = req.headers['x-secret-token'];
    if (secretToken !== process.env.SECRET_TOKEN) {
        next();
    } else if (referer) {
        try {
            const domain = new URL(referer).hostname;

            if (allowedDomains.includes(domain)) {
                next();
            } else {
                res.status(403).send(`Unauthorized Domain - ${domain}`);
                console.log(`Access denied: Authorization not granted for this domain - ${domain}`);
            }
        } catch (err) {
            console.log(`Invalid URL error: ${err.message}`);
            res.status(400).send('Unauthorized Domain');
        }
    } else {
        console.log('No referer has been specified for this request.');
        res.status(403).send('Unauthorized Domain');
    }

}

module.exports = {
    checkDomain
};
