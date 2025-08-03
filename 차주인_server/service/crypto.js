const crypto = require('crypto');
const forge = require('node-forge');
const asn1js = require('asn1.js');
const fs = require('fs').promises;
const path = require('path');

// ASN.1 스키마 정의
const PackageSchema = asn1js.define('PackageSchema', function() {
    this.sequence().obj(
        this.key('encryptedKey').octetString(),
        this.key('encryptedIv').octetString(),
        this.key('signedData').octetString(),
        this.key('encryptedData').octetString()
    );
});

class KotsaSecurity {
    constructor(publicKeyFile, privateKeyFile, privateKeyPassword) {
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
        return privateKey.decrypt(encryptedData);
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
        return publicKey.encrypt(data);
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
        const sign = forge.pki.rsa.createSignature({
            privateKey: privateKey,
            md: forge.md.sha256.create()
        });
        sign.update(encryptedData);
        return sign.sign();
    }

    // 서명 검증
    async verify(publicKey, verifyData, signData) {
        const verifier = forge.pki.rsa.createVerification({
            publicKey: publicKey,
            md: forge.md.sha256.create()
        });
        verifier.update(verifyData);
        return verifier.verify(signData);
    }

    // 개인키 읽기
    async readPrivateKey() {
        const pem = await fs.readFile(this.privateKeyFile, 'utf8');
        const encryptedKey = forge.pki.encryptedPrivateKeyFromPem(pem);
        const privateKey = forge.pki.decryptPrivateKey(encryptedKey, this.privateKeyPassword);
        return privateKey;
    }

    // 공개키 읽기
    async readPublicKey() {
        const pem = await fs.readFile(this.publicKeyFile, 'utf8');
        return forge.pki.publicKeyFromPem(pem);
    }

    // 실시간 복호화
    async realtimeDecrypt(encryptedData) {
        try {
            const kotsaPublicKey = await this.readPublicKey();
            const selfPrivateKey = await this.readPrivateKey();
            
            const unpackedData = this.dataUnpacking(this.decode(encryptedData));
            const [encryptedKey, encryptedIv, signedData, encryptedMessage] = unpackedData;

            // 서명 검증
            const isValid = await this.verify(kotsaPublicKey, encryptedMessage, signedData);
            if (!isValid) {
                throw new Error('전자서명 검증에 실패하였습니다.');
            }

            // 키와 IV 복호화
            const decryptedKey = await this.decryptByPrivateKey(selfPrivateKey, encryptedKey);
            const decryptedIv = await this.decryptByPrivateKey(selfPrivateKey, encryptedIv);

            // 메시지 복호화
            const decryptedMessage = this.decryptByKey(
                decryptedKey,
                decryptedIv,
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

            const key = this.generateKey();
            const iv = this.generateIv();

            // 메시지 암호화
            const encryptedMessage = this.encryptByKey(key, iv, requestData);
            
            // 전자서명
            const signedData = await this.sign(selfPrivateKey, encryptedMessage);

            // 키와 IV 암호화
            const encryptedKey = await this.encryptByPublicKey(kotsaPublicKey, key);
            const encryptedIv = await this.encryptByPublicKey(kotsaPublicKey, iv);

            // 데이터 패키징
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