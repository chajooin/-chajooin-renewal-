const fs = require('fs');
const asn1js = require('asn1.js');
const forge = require('node-forge');
const path = require('path')
const crypto = require('crypto');
const axios = require('axios')

const senderData = {
    "data": [{
        "vhclNo": "01가1234"
    }]
}

const pubKeyPath = path.join(process.env.PWD, '/keys/signCert_kotsa.der')
const privKeyPath = path.join(process.env.PWD, '/keys/private_key.pem')
const privKeyPath2 = path.join(process.env.PWD, '/keys/private_key.der')
const test = path.join(process.env.PWD, '/keys/aplynx_test.pem')
const privKeyPass = "test1234!";

const derBuffer = fs.readFileSync(pubKeyPath);
const certAsn1 = forge.asn1.fromDer(forge.util.createBuffer(derBuffer));
const cert = forge.pki.certificateFromAsn1(certAsn1);



// 데이터 암호화를 위한 키생성
const generateKey = () => {
    // 128비트 = 16바이트
    return crypto.randomBytes(16); // returns a Buffer
}

// iv todtjd
const generateIv = () => {
    return crypto.randomBytes(16)
}
// 서명 검증
async function verify(publicKey, verifyData, signData) {
    const md = forge.md.sha256.create();
    md.update(verifyData.toString('binary'));
    return publicKey.verify(md.digest().bytes(), signData.toString('binary'));
}
const encryptByKey = (key, iv, message) => {
    const cipher = crypto.createCipheriv('seed-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted;
}

const decryptByKey = (key, iv, encryptedMessage) => {
    const decipher = crypto.createDecipheriv('seed-cbc', key, iv);
    let decrypted = decipher.update(encryptedMessage);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

const PackageSchema = asn1js.define('PackageSchema', function () {
    this.seq().obj(
        this.key('encryptedKey').octstr(),
        this.key('encryptedIv').octstr(),
        this.key('signedData').octstr(),
        this.key('encryptedData').octstr()
    );
});

// 데이터 패키징
function dataPacking(encryptedKey, encryptedIv, signedData, encryptedData) {
    const packageData = PackageSchema.encode({
        encryptedKey,
        encryptedIv,
        signedData,
        encryptedData
    }, 'der');
    return packageData;
}
// 데이터 언패키징
function dataUnpacking(packagedData) {
    const decoded = PackageSchema.decode(packagedData, 'der');
    return [
        decoded.encryptedKey,
        decoded.encryptedIv,
        decoded.signedData,
        decoded.encryptedData
    ];
}

// Base64 인코딩
function encode(data) {
    return Buffer.from(data).toString('base64');
}
// Base64 디코딩
function decode(data) {
    return Buffer.from(data, 'base64');
}

const realtimeDecrypt = async (data) => {
    const privateKeyPem = fs.readFileSync(privKeyPath, "utf8");

    const packagedData = dataUnpacking(decode(data));
    const [encryptedKey, encryptedIv, signedData, encryptedMessage] = packagedData;
    console.log("-----", encryptedKey);
    console.log("-----", encryptedIv);
    console.log("-----", signedData);
    console.log("-----", encryptedMessage);

    const certPem = forge.pki.publicKeyToPem(cert.publicKey);
    console.log("certPem", certPem)
    console.log("dec@@@@",encryptedMessage);
    const isValid = crypto.verify('sha256', encryptedMessage, {
        key: certPem,
        // padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    }, signedData);

    console.log("isValid", isValid)
    if (!isValid) {
        throw new Error('전자서명 검증에 실패하였습니다.');
    }

    const decryptedKey = crypto.privateDecrypt({
        key: privateKeyPem,
        // padding: crypto.RSA_PKCS1_OAEP_PADDING,
        hash: 'sha256'
    }, encryptedKey);
    console.log(decryptedKey)
    const decryptedIv = crypto.privateDecrypt({
        key: privateKeyPem,
        // padding: crypto.RSA_PKCS1_OAEP_PADDING,
        hash: 'sha256'
    }, encryptedIv);
    console.log(decryptedIv)

    const decryptedMessage = decryptByKey(
        Buffer.from(decryptedKey, 'binary'),
        Buffer.from(decryptedIv, 'binary'),
        encryptedMessage
    );
    return decryptedMessage.toString('utf8');
}

const realtimeEncrypt = (data) => {
    // 키생성
    const key = generateKey();
    // iv 생성
    const iv = generateIv();
    // 메시지 암호화
    const encData = encryptByKey(key, iv, data)
    // 전자서명
    const privateKeyPem = fs.readFileSync(privKeyPath, "utf8");
    console.log("cert", privateKeyPem)
    const signedData = crypto.sign('sha256', encData, {
        key: privateKeyPem,
        // padding: crypto.constants.RSA_PKCS1_PSS_PADDING, // 혹은 PKCS1_PADDING
    });

    console.log("enc@@@@",encData);
    // crypto.privateEncrypt({
    //     key: privateKeyPem,
    //     padding: crypto.RSA_PKCS1_OAEP_PADDING,
    //     hash: 'sha256'
    // }, encData);

    // 키 암호화
    const encKey = Buffer.from(cert.publicKey.encrypt(key.toString('binary'), 'RSA-OAEP'), 'binary');
    // iv 암호화
    const encIv = Buffer.from(cert.publicKey.encrypt(iv.toString('binary'), 'RSA-OAEP'), 'binary');
    // 데이터 패키징
    const packagedData = dataPacking(
        encKey,
        encIv,
        signedData,
        encData
    );
    // base64 암호화

    return encode(packagedData)
}


const sendData = async () => {
    // PEM 파일 읽기
    const bodyData = realtimeEncrypt(JSON.stringify(senderData))
    console.log("bodyData", bodyData)

    const decData = await realtimeDecrypt(bodyData)
    console.log(decData)
    // 예시: 개인키를 사용한 암호화/복호화 작업


    // 암호화된 데이터를 복호화하는 예시

    // const decryptedData = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));

    // 복호화된 데이터 출력
    // console.log('Decrypted Data:', decryptedData.toString());
    // return;
    console.log("---- post -----")
    axios.post("http://27.101.233.69:28080/hub/kotsa", bodyData, {
        headers: {
            "Accept": "plan/text",
            "Content-Type": "application/json",
            "cvmis_apikey": "72651AF6-5E9EE3FD-1689C48A-8AE460EE"
        }
    }).then((result) => {
        console.log("result", result)
    }).catch((e) => {
        console.log("e", e)
    })
}
sendData();

