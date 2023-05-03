const crypto = require('crypto');

const defaultAlgo = 'sha256';

function hash(message) {
    let handler = crypto.createHash(defaultAlgo);
    return handler.update(message, 'utf-8').digest('hex');
}

exports.hash = hash;