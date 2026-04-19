# CLAUDE.md

このファイルはこのリポジトリで Claude Code (claude.ai/code) が作業する際のガイドラインをまとめたもの。

## プロジェクト概要

Sake Log（日本酒ログ）— 日本酒のテイスティングを記録する Expo / React Native (TypeScript) アプリ。ビジュアルシステムは Stitch のデザインプロジェクトを源泉とし、`src/theme/` + `src/components/` 配下に RN のローカルデザインシステムとして再実装している。

## コマンド

- `npm run start` — Expo dev server (Metro) を起動
- `npm run web` / `npm run ios` / `npm run android` — 各プラットフォームで起動
- `npx tsc --noEmit` — 型チェック（strict）。ESLint / Prettier / テストランナーは未導入で、静的検査は `tsc` のみ。
- `npx expo install <pkg>` — ネイティブ連携ありの依存を追加する時はこちらを使う（Expo 管理下の SDK 互換バージョンが選ばれる）。

devcontainer の `postCreateCommand.sh` で **Stitch MCP サーバ**が登録されており、AI が Stitch のデザインシステムを作成・更新したり、プロンプトから画面を生成したりできる。Stitch プロジェクトは `projects/16062033344857122900`（asset `assets/637580641448852477`）。

## アーキテクチャ

### デザインシステムの流れ（Stitch → RN）
Stitch がデザイントークンの source of truth を持つ（primary `#C28840`、見出し `NEWSREADER` / 本文 `INTER`、`ROUND_TWELVE`）。これらのトークンは `src/theme/` に手作業でミラーされている — Stitch は RN コードを emit しないため、トークンを変えるときは両方を更新する必要がある。トークンはファイル単位で分かれており（`colors.ts`, `typography.ts`, `spacing.ts`, `shadows.ts`）、`theme.ts` で `lightTheme` / `darkTheme` に合成される。`ThemeProvider.tsx` が `system` / `light` / `dark` に基づいてどちらかを選び、コンポーネントは `useTheme()` で参照する。

**絶対ルール:** コンポーネントは色・フォントサイズ・角丸・余白を決して直書きしない — 必ず `useTheme()` 経由で取得する。新しいトークンを使うときは先にテーマファイルへ追加してから参照する。

### コンポーネントライブラリ (`src/components/`)
すべてのコンポーネントはテーマ対応で、`src/components/index.ts` からエクスポートされている。`Text` はタイポグラフィのバリアントとセマンティックな色を解決する。`Button` は `filled | tonal | outline | ghost` × `sm | md | lg`。`Screen` は safe-area と背景を適用するルートラッパー。`Stack` はレイアウトのプリミティブ（素の `View` に flex スタイルを当てるより優先して使う）。`ImagePickerField` は `expo-image-picker` を権限ハンドリングとプレビュー UI でラップしたもの。

### 永続化 (`src/lib/records.ts`)
レコードは AsyncStorage に JSON で保存（キー `sake-log:records:v1`）。画像はピッカーの一時キャッシュ URI から `documentDirectory/sake-images/` にコピーされ、キャッシュ削除後も残る。**`expo-file-system` のクラスベース新 API**（`File`, `Directory`, `Paths`）を使用している — レガシーな関数ベース API ではない。レガシー API が必要なときは明示的に `expo-file-system/legacy` から import する。

### フォント
Google Fonts は `app/_layout.tsx` で `@expo-google-fonts/newsreader` + `@expo-google-fonts/inter` を使ってアプリ起動時に読み込む。タイポグラフィのトークンはこれらの正確なファミリー名（例: `Newsreader_600SemiBold`）を参照しているため、ウェイトを差し替えるときは `_layout.tsx` で該当ウェイトを読み込みつつ **`src/theme/typography.ts` の `fontFamilies` も更新**する必要がある。

### ルーティング (`app/`)
**expo-router**（ファイルベース）を使う。エントリは `package.json#main` 経由の `expo-router/entry`。`App.tsx` や `index.ts` を再作成しないこと。構成：

- `app/_layout.tsx` — ルート Stack。すべてを `ThemeProvider` でラップし、フォントを読み込み、ネイティブヘッダーをテーマ化する。
- `app/(tabs)/_layout.tsx` — 下タブ（`一覧`, `記録`）。`(tabs)` グループは URL から除外される。
- `app/(tabs)/index.tsx` — レコード一覧（ルート `/`）。
- `app/(tabs)/new.tsx` — 新規レコードフォーム（ルート `/new`）。保存時は `/` に遷移して一覧をリフレッシュする。
- `app/records/[id].tsx` — 詳細（ルート `/records/:id`）。タブの上にスタックされる。

一覧/詳細画面は `useFocusEffect`（`expo-router` から再エクスポートされている）を使い、グローバルストアで状態を保持するのではなくタブフォーカス時に再取得する。`src/screens/ShowcaseScreen.tsx` は**ルーティングされていない** — コンポーネントのリファレンス/デモ用。

ディープリンク用に `app.json` に `"scheme": "sakelog"` を設定している。

## 規約

- **言語**: ユーザー向けの文言はすべて日本語で書く（`Alert` メッセージや `accessibilityLabel` も含む）。
- **日付フォーマット**: レコードは `YYYY-MM-DD` 文字列を使う。`RecordScreen` が `DATE_PATTERN` 正規表現で検証する。日付ライブラリは使わない。
- **ID**: `records.ts` の `makeId()` は `Date.now()` + ランダムを組み合わせる — ローカル専用ストレージなら十分だが、同期を足すなら差し替えること。
