var crypt = require('crypto');
// const config = require('config');
var PKCS7Encoder :any= {};

PKCS7Encoder.decode= function (text:any) {
    var pad = text[text.length - 1];

    if (pad < 1 || pad > 16) {
        pad = 0;
    }

    return text.slice(0, text.length - pad);
};

PKCS7Encoder.encode= function (text:any) {
    var blockSize = 16;
    var textLength = text.length;

    var amountToPad = blockSize - (textLength % blockSize);

    var result = new Buffer(amountToPad);
    result.fill(amountToPad);

    return Buffer.concat([text, result]);
};

function generateString(length :any) {
    if (length === 0) {
        throw new Error('Zero-length randomString is useless.');
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789';
    let objectId = '';
    const bytes = crypt.randomBytes(length);

    for (let i = 0; i < bytes.length; ++i) {
        objectId += chars[bytes.readUInt8(i) % chars.length];
    }

    return objectId;
}

const encrypt = function (text:any, key:any) {
    
    key = key.split("-").join("").trim()
    console.log(key,'key mofifird');
    
    var encoded = PKCS7Encoder.encode(Buffer.from(text));

    var iv = /*generateString(16)*/ process.env.OUTER_KEY_IV
    var cipher = crypt.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(false);
    var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
    return iv + cipheredMsg.toString('base64');

};

const decrypt= function (text:any, key:any) {
    try {
        var iv:any = process.env.OUTER_KEY_IV
    console.log(text,'text');
    
    var decipher = crypt.createDecipheriv('aes-256-cbc', key, iv);
        console.log('gg');
        
    decipher.setAutoPadding(false);
    var deciphered = Buffer.concat([decipher.update(text.replace(iv.toString(), ""), 'base64'), decipher.final()]);
    deciphered = PKCS7Encoder.decode(deciphered);
    return deciphered.toString();
    } catch (error) {
        console.log(error);
        
        // res.send(err

    }
    
};

export {encrypt,decrypt}