const crypto = require("crypto");
const key = Buffer.from(process.env.ENC_KEY, "hex");

exports.encrypt = (text) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    data: enc.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
};

exports.decrypt = ({ data, iv, tag }) => {
  const d = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(iv, "hex"));
  d.setAuthTag(Buffer.from(tag, "hex"));
  return Buffer.concat([d.update(Buffer.from(data, "hex")), d.final()]).toString("utf8");
};