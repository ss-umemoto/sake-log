import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';

const STORAGE_KEY = 'sake-log:records:v1';
const IMAGE_DIR_NAME = 'sake-images';

export type SakeRecord = {
  id: string;
  imageUri: string | null;
  rating: number;
  date: string;
  memo: string;
  createdAt: number;
};

export type NewSakeRecord = Omit<SakeRecord, 'id' | 'createdAt'>;

function imagesDir(): Directory {
  const dir = new Directory(Paths.document, IMAGE_DIR_NAME);
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  return dir;
}

function makeId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function persistImage(sourceUri: string, id: string): string {
  const ext = sourceUri.includes('.') ? sourceUri.split('.').pop()!.split('?')[0] : 'jpg';
  const dest = new File(imagesDir(), `${id}.${ext}`);
  const src = new File(sourceUri);
  src.copy(dest);
  return dest.uri;
}

function deleteImageSafely(uri: string | null) {
  if (!uri) return;
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // ignore - image may have been cleaned up already
  }
}

export async function getRecord(id: string): Promise<SakeRecord | null> {
  const all = await listRecords();
  return all.find((r) => r.id === id) ?? null;
}

export async function listRecords(): Promise<SakeRecord[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as SakeRecord[];
    return parsed.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function saveRecord(input: NewSakeRecord): Promise<SakeRecord> {
  const id = makeId();
  const imageUri = input.imageUri ? persistImage(input.imageUri, id) : null;
  const record: SakeRecord = {
    id,
    imageUri,
    rating: input.rating,
    date: input.date,
    memo: input.memo,
    createdAt: Date.now(),
  };
  const current = await listRecords();
  const next = [record, ...current];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return record;
}

export async function deleteRecord(id: string): Promise<void> {
  const current = await listRecords();
  const target = current.find((r) => r.id === id);
  if (target) deleteImageSafely(target.imageUri);
  const next = current.filter((r) => r.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
