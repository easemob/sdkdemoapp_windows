import crypto from "crypto";

/**
 * Encrypt data with aes
 * @param  {string} data
 * @return {Buffer}
 */
const encrypt = (data, token, cipherIV) => {
	const cipher = crypto.createCipheriv("aes-256-cbc", token, cipherIV);
	let crypted = cipher.update(data, "utf8", "binary");
	crypted += cipher.final("binary");
	crypted = new Buffer(crypted, "binary");
	return crypted;
};

/**
 * Decrypt data
 * @param  {Buffer} data
 * @return {string}
 */
const decrypt = (data, token, cipherIV) => {
	const decipher = crypto.createDecipheriv("aes-256-cbc", token, cipherIV);
	let decoded = decipher.update(data, "binary", "utf8");
	decoded += decipher.final("utf8");
	return decoded;
};

export default {
	encrypt,
	decrypt
};
