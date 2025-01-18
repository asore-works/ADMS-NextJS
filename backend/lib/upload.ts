// backend/lib/upload.ts
import crypto from 'crypto';
import { writeFile } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function saveImage(file: File): Promise<string> {
  try {
    // ランダムなファイル名を生成
    const bytes = crypto.randomBytes(16);
    const fileName = `${bytes.toString('hex')}${path.extname(file.name)}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // ArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ファイルを保存
    await writeFile(filePath, buffer);

    // 相対パスを返す
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Image save error:', error);
    throw new Error('画像の保存に失敗しました');
  }
}