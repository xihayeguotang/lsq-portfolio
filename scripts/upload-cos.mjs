/**
 * 腾讯云 COS 上传脚本（官方 SDK：cos-nodejs-sdk-v5）
 *
 * 用途：把本地文件上传到 COS 资源桶，例如作品集详情数据
 *   node scripts/upload-cos.mjs                        # 默认上传 cos-upload/portfolio-details.json → WorkExperience/portfolio-details.json
 *   node scripts/upload-cos.mjs <本地文件> <COS路径>     # 自定义文件与目标路径
 *
 * 前置条件：在 .env.local 中添加腾讯云密钥（永久密钥）
 *   COS_SECRET_ID=AKIDxxxx
 *   COS_SECRET_KEY=xxxx
 * 密钥仅存本地，不会提交到 git。
 */
import { readFileSync, existsSync } from "fs";
import COS from "cos-nodejs-sdk-v5";

const ROOT = new URL("../", import.meta.url);

/** 解析 .env.local（简易 KEY=VALUE，支持引号） */
function loadEnv(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return env;
}

const env = loadEnv(new URL(".env.local", ROOT));
const secretId = env.COS_SECRET_ID;
const secretKey = env.COS_SECRET_KEY;

if (!secretId || !secretKey) {
  console.error("[upload] 缺少 COS_SECRET_ID / COS_SECRET_KEY，请在 .env.local 中添加腾讯云密钥");
  process.exit(1);
}

// ── 参数：默认上传作品集详情数据 ──
const DEFAULT_LOCAL = new URL("cos-upload/portfolio-details.json", ROOT);
const DEFAULT_KEY = "WorkExperience/portfolio-details.json";
const localArg = process.argv[2];
const keyArg = process.argv[3];
const localPath = localArg ? new URL(localArg, ROOT) : DEFAULT_LOCAL;
const key = keyArg || DEFAULT_KEY;

if (!existsSync(localPath)) {
  console.error(`[upload] 文件不存在: ${localPath.pathname}`);
  process.exit(1);
}

const BUCKET = "liangsq-1440954703";
const REGION = "ap-beijing";
const HOST = `${BUCKET}.cos.${REGION}.myqcloud.com`;

const body = readFileSync(localPath);
const fileName = localPath.pathname.split("/").pop();

const cos = new COS({ SecretId: secretId, SecretKey: secretKey });

console.log(`[upload] 上传 ${fileName} → ${HOST}/${key} (${body.length} bytes)`);

cos.putObject(
  {
    Bucket: BUCKET,
    Region: REGION,
    Key: key,
    Body: body,
    ContentType: "application/json; charset=utf-8",
  },
  (err, data) => {
    if (err) {
      console.error(`[upload] 失败 ${err.statusCode ?? ""} ${err.code ?? ""}: ${(err.message ?? "").slice(0, 500)}`);
      process.exit(1);
    }
    console.log(`[upload] ✅ 上传成功 → https://${HOST}/${key}`);
  }
);
