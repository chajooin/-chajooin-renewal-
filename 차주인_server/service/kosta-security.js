const crypto = require('crypto');
const forge = require('node-forge');
const asn1js = require('asn1.js');
const fs = require('fs').promises;
const path = require('path');
const inconv = require('iconv-lite');

// ASN.1 스키마 정의
const PackageSchema = asn1js.define('PackageSchema', function () {
    this.sequence().obj(
        this.key('encryptedKey').octetString(),
        this.key('encryptedIv').octetString(),
        this.key('signedData').octetString(),
        this.key('encryptedData').octetString()
    );
});

class KotsaSecurity {
    constructor (publicKeyFile, privateKeyFile, privateKeyPassword) {
        this.publicKeyFile = publicKeyFile;
        this.privateKeyFile = privateKeyFile;
        this.privateKeyPassword = privateKeyPassword;
        this.BUFFER_SIZE = 4096;
    }

    // 데이터 패키징
    dataPacking(encryptedKey, encryptedIv, signedData, encryptedData) {
        const packageData = PackageSchema.encode({
            encryptedKey,
            encryptedIv,
            signedData,
            encryptedData
        }, 'der');
        return packageData;
    }

    // 데이터 언패키징
    dataUnpacking(packagedData) {
        const decoded = PackageSchema.decode(packagedData, 'der');
        return [
            decoded.encryptedKey,
            decoded.encryptedIv,
            decoded.signedData,
            decoded.encryptedData
        ];
    }

    // Base64 디코딩
    decode(data) {
        return Buffer.from(data, 'base64');
    }

    // Base64 인코딩
    encode(data) {
        return Buffer.from(data).toString('base64');
    }

    // RSA 개인키로 복호화
    async decryptByPrivateKey(privateKey, encryptedData) {
        return privateKey.decrypt(encryptedData.toString('binary'), 'RSA-OAEP');
    }

    // SEED 복호화
    decryptByKey(key, iv, encryptedMessage) {
        const decipher = crypto.createDecipheriv('seed-cbc', key, iv);
        let decrypted = decipher.update(encryptedMessage);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    }

    // RSA 공개키로 암호화
    async encryptByPublicKey(publicKey, data) {
        return Buffer.from(publicKey.encrypt(data.toString('binary'), 'RSA-OAEP'), 'binary');
    }

    // SEED 암호화
    encryptByKey(key, iv, message) {
        const cipher = crypto.createCipheriv('seed-cbc', key, iv);
        let encrypted = cipher.update(message, 'utf8');
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted;
    }

    // 파일 해시 생성
    async extractFileHash(filePath) {
        const fileBuffer = await fs.readFile(filePath);
        return crypto.createHash('sha256').update(fileBuffer).digest();
    }

    // IV 생성
    generateIv() {
        return crypto.randomBytes(16);
    }

    // 키 생성
    generateKey() {
        return crypto.randomBytes(16); // SEED는 128비트 키 사용
    }

    // 전자서명
    async sign(privateKey, encryptedData) {
        const md = forge.md.sha256.create();
        md.update(encryptedData.toString('binary'));
        return Buffer.from(privateKey.sign(md), 'binary');
    }

    // 서명 검증
    async verify(publicKey, verifyData, signData) {
        const md = forge.md.sha256.create();
        md.update(verifyData.toString('binary'));
        return publicKey.verify(md.digest().bytes(), signData.toString('binary'));
    }

    // 개인키 읽기 (.key - PEM 형식, 암호화된 경우)
    async readPrivateKey() {
        const pem = await fs.readFile(this.privateKeyFile);
        const encryptedKey = forge.pki.encryptedPrivateKeyFromPem(pem);
        const privateKey = forge.pki.decryptPrivateKey(encryptedKey, this.privateKeyPassword);
        console.log(encryptedKey, privateKey)
        if (!privateKey) throw new Error('비밀번호가 틀리거나 PEM 파일 형식이 잘못되었습니다.');
        return privateKey;
    }

    // 공개키 읽기 (.der - DER 형식 X.509 인증서)
    async readPublicKey() {
        const derBuffer = await fs.readFile(this.publicKeyFile);
        const asn1Obj = forge.asn1.fromDer(derBuffer.toString('binary'));
        const cert = forge.pki.certificateFromAsn1(asn1Obj);
        return cert.publicKey;
    }

    // 실시간 복호화
    async realtimeDecrypt(encryptedData) {
        try {
            const kotsaPublicKey = await this.readPublicKey();
            const selfPrivateKey = await this.readPrivateKey();

            const unpackedData = this.dataUnpacking(this.decode(encryptedData));
            const [encryptedKey, encryptedIv, signedData, encryptedMessage] = unpackedData;

            const isValid = await this.verify(kotsaPublicKey, encryptedMessage, signedData);
            if (!isValid) {
                throw new Error('전자서명 검증에 실패하였습니다.');
            }

            const decryptedKey = await this.decryptByPrivateKey(selfPrivateKey, encryptedKey);
            const decryptedIv = await this.decryptByPrivateKey(selfPrivateKey, encryptedIv);

            const decryptedMessage = this.decryptByKey(
                Buffer.from(decryptedKey, 'binary'),
                Buffer.from(decryptedIv, 'binary'),
                encryptedMessage
            );

            return decryptedMessage.toString('utf8');
        } catch (error) {
            throw error;
        }
    }

    // 실시간 암호화
    async realtimeEncrypt(requestData) {
        try {
            const kotsaPublicKey = await this.readPublicKey();
            const selfPrivateKey = await this.readPrivateKey();
            console.log("selfPrivateKey:", selfPrivateKey);

            const key = this.generateKey();
            const iv = this.generateIv();

            const encryptedMessage = this.encryptByKey(key, iv, requestData);

            const signedData = await this.sign(selfPrivateKey, encryptedMessage);

            const encryptedKey = await this.encryptByPublicKey(kotsaPublicKey, key);
            const encryptedIv = await this.encryptByPublicKey(kotsaPublicKey, iv);

            const packagedData = this.dataPacking(
                encryptedKey,
                encryptedIv,
                signedData,
                encryptedMessage
            );

            return this.encode(packagedData);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = KotsaSecurity;