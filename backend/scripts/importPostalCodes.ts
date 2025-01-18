// backend/scripts/importPostalCodes.ts
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import iconv from 'iconv-lite';
import fetch from 'node-fetch';
import { Extract } from 'unzip-stream';

const prisma = new PrismaClient();

async function downloadFile(url: string, outputPath: string): Promise<void> {
  console.log('Downloading file...');
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download: ${response.statusText}`);
  
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(outputPath);
    if (!response.body) {
      reject(new Error('No response body'));
      return;
    }
    
    (response.body as any).pipe(fileStream)
      .on('finish', () => {
        console.log('Download completed');
        resolve();
      })
      .on('error', (error: Error) => {
        console.error('Download error:', error);
        reject(error);
      });
  });
}

async function processCSVRow(row: any) {
  try {
    if (!row.postalCode || !row.prefecture || !row.city || !row.street) {
      console.warn('Skipping invalid row:', row);
      return;
    }

    await prisma.postalCode.upsert({
      where: {
        postalCode: row.postalCode
      },
      update: {
        prefecture: row.prefecture,
        city: row.city,
        street: row.street
      },
      create: {
        postalCode: row.postalCode,
        prefecture: row.prefecture,
        city: row.city,
        street: row.street
      }
    });
  } catch (error) {
    console.error(`Error processing postal code ${row.postalCode}:`, error);
  }
}

async function importPostalCodes() {
  const tempDir = path.join(__dirname, 'temp');
  const zipFilePath = path.join(tempDir, 'ken_all.zip');
  const csvFilePath = path.join(tempDir, 'KEN_ALL.CSV');

  try {
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Download the zip file
    console.log('Starting download...');
    await downloadFile(
      'https://www.post.japanpost.jp/zipcode/dl/kogaki/zip/ken_all.zip',
      zipFilePath
    );

    // Extract the zip file
    console.log('Extracting zip file...');
    await new Promise((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(Extract({ path: tempDir }))
        .on('close', resolve)
        .on('error', reject);
    });

    // Process the CSV file
    console.log('Processing CSV file...');
    let processedCount = 0;

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(iconv.decodeStream('SJIS'))
        .pipe(csv({
          headers: [
            'nationalLocalGovernmentCode',
            'oldPostalCode',
            'postalCode',
            'prefectureKana',
            'cityKana',
            'streetKana',
            'prefecture',
            'city',
            'street',
            'flag1',
            'flag2',
            'flag3',
            'flag4',
            'flag5',
            'flag6'
          ],
          skipLines: 0
        }))
        .on('data', async (row) => {
          await processCSVRow(row);
          processedCount++;
          if (processedCount % 1000 === 0) {
            console.log(`Processed ${processedCount} records...`);
          }
        })
        .on('end', () => {
          console.log(`Completed processing ${processedCount} records`);
          resolve(true);
        })
        .on('error', (error) => {
          console.error('Error processing CSV:', error);
          reject(error);
        });
    });

    // Cleanup
    console.log('Cleaning up temporary files...');
    try {
      if (fs.existsSync(zipFilePath)) fs.unlinkSync(zipFilePath);
      if (fs.existsSync(csvFilePath)) fs.unlinkSync(csvFilePath);
      if (fs.existsSync(tempDir)) fs.rmdirSync(tempDir);
    } catch (error) {
      console.error('Error during cleanup:', error);
    }

  } catch (error) {
    console.error('Error in import process:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
console.log('Starting postal code import process...');
importPostalCodes()
  .then(() => {
    console.log('Import process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import process failed:', error);
    process.exit(1);
  });