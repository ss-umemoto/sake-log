# Sake Log（日本酒ログ）

Expo / React Native（TypeScript）で作る、日本酒のテイスティング記録アプリ。ローカル保存のみで外部同期なし。

## セットアップ

```bash
npm install
```

## 開発

| コマンド | 用途 |
| --- | --- |
| `npm run start` | Expo dev server を起動 |
| `npm run android` | Android を立ち上げて起動 |
| `npm run ios` | iOS シミュレータで起動 |
| `npm run web` | Web ブラウザで起動 |
| `npx tsc --noEmit` | 型チェック（唯一の静的検査） |

ESLint / Prettier / テストランナーは未導入。静的検査は `tsc` のみ。

### 実機（Expo Go）で確認

WSL2 / devcontainer からだとローカルネットワーク越しに繋がらないので tunnel を使う：

```bash
npx expo start --tunnel
```

表示される QR コードを Android 端末の **Expo Go** アプリ、または iOS のカメラで読み取る。

## スマホに直接インストール（EAS Build）

Expo Go を使わず、単体アプリとして自分のスマホに入れる場合は EAS Build で APK を作る。

### 初回のみ

```bash
npx eas-cli login          # Expo アカウントでログイン
npx eas-cli init           # プロジェクトを Expo にリンク（app.json に projectId 追記）
```

### ビルド（以降毎回）

```bash
npx eas-cli build -p android --profile preview
```

- クラウドで 10〜20 分ビルド
- 初回は keystore を聞かれるので **Generate new keystore** を選ぶ（Expo 側で保管）
- 完了すると APK の URL と QR が出るので、スマホで読んで DL → インストール
  - 初回インストール時は「提供元不明のアプリ」の許可が必要

ビルド履歴は https://expo.dev/accounts/hijiri.umemoto/projects/sake-log/builds から確認できる。

### プロファイル

`eas.json` で 3 種類定義済み：

- `preview` — APK、内部配布用。普段はこれ。
- `development` — dev client 入りビルド。ネイティブモジュールを足したくなったら使う。
- `production` — 本番向け（aab、`autoIncrement` あり）。ストア公開時のみ。

## ディレクトリ構成

- `app/` — **ルーティング専用**。expo-router のファイルベースルート。ここには薄いルートファイルだけを置き、画面の実装は `src/` 側に書く。
  - `app/_layout.tsx` — ルート Stack。`ThemeProvider` とフォント読み込み。
  - `app/(tabs)/` — 下タブ（一覧 / 記録）。
  - `app/records/[id].tsx` — 詳細画面。
- `src/theme/` — デザイントークン（色・タイポ・余白・角丸・影）と `ThemeProvider`。Stitch プロジェクトから手作業でミラーしたもの。
- `src/components/` — 再利用 UI（`Text`, `Button`, `Screen`, `Stack`, `ImagePickerField` など）。
- `src/lib/` — ロジック（`records.ts`：AsyncStorage 永続化と画像コピー）。
- `src/screens/` — 画面コンポーネント本体。

依存方向は `app/ → src/screens → src/components → src/theme` / `src/lib`。`src/` 側から `app/` を import しない。

## ルール

- 色・フォントサイズ・余白・角丸を **直書きしない**。必ず `useTheme()` 経由。
- ユーザー向け文言は **すべて日本語**（`Alert` や `accessibilityLabel` も）。
- 記録の日付は `YYYY-MM-DD` 文字列。日付ライブラリは未使用。
- 画像は `expo-file-system` の新しいクラス API（`File`, `Directory`, `Paths`）で `documentDirectory/sake-images/` にコピー保存。

詳細な設計メモは [`CLAUDE.md`](./CLAUDE.md) に集約。
