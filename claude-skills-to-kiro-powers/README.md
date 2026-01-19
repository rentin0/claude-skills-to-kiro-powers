# Claude Code Skills to Kiro Powers CLI

Claude Code Skills を Kiro Powers に変換する CLI ツール（MVP）

## 機能

- 📥 **skillsmp.com からのインストール** - Claude Code Skills を直接ダウンロード
- 🔄 **自動変換** - SKILL.md を POWER.md に変換
- 📦 **補助ファイル対応** - REFERENCE.md、scripts、resources をコピー
- 🏠 **ホームディレクトリ対応** - `~/.kiro/powers/` に自動配置
- 🔗 **一括変換** - 複数のスキルを同時に変換
- 🎨 **豪華な TUI** - Ink を使用した美しいターミナルインターフェース

## インストール

```bash
bun install
```

## 使用方法

### 1. シンプル CLI（従来型）

```bash
# ローカルのスキルを変換
bun run src/cli.ts --convert ./my-skill

# 出力先を指定
bun run src/cli.ts --convert ./my-skill --output ./output/my-power

# skillsmp.com からインストール・変換
bun run src/cli.ts --install database-query-helper
```

### 2. TUI CLI（豪華版）

```bash
# ローカルのスキルを変換（TUI 表示）
bun run src/cli-tui.tsx --convert ./my-skill

# skillsmp.com からインストール・変換（TUI 表示）
bun run src/cli-tui.tsx --install database-query-helper
```

### 3. インタラクティブ TUI（メニュー形式）

```bash
# メニュー形式で操作
bun run src/cli-interactive.tsx
```

このモードでは、以下の操作が可能です：
- ローカルのスキルを変換
- skillsmp.com からインストール・変換
- 出力先ディレクトリを指定

### 4. 複数のスキルを一括変換

```bash
bun run scripts/batch-convert.ts database-query-helper code-review-assistant
```

## ビルド

```bash
bun run build
```

ビルド後は以下のコマンドで実行できます：

```bash
# シンプル CLI
bun dist/cli.js --convert ./my-skill

# TUI CLI
bun dist/cli-tui.js --convert ./my-skill

# インタラクティブ TUI
bun dist/cli-interactive.js
```

## 変換ルール

| Claude Code | Kiro Power |
|-------------|-----------|
| `name` | `name` |
| `description` | `description` |
| - | `displayName` (name から自動生成) |
| - | `keywords` (description から自動抽出) |
| - | `author` (デフォルト: "Claude Code Skills") |

## ファイル構造

```
claude-skills-to-kiro-powers/
├── src/
│   ├── cli.ts                  # シンプル CLI
│   ├── cli-tui.tsx             # TUI CLI
│   ├── cli-interactive.tsx     # インタラクティブ TUI
│   ├── converter.ts            # 変換ロジック
│   ├── downloader.ts           # ダウンロードロジック
│   ├── utils.ts                # ユーティリティ関数
│   └── ui/
│       ├── index.tsx           # UI コンポーネント
│       ├── header.tsx          # ヘッダー
│       ├── status.tsx          # ステータス表示
│       ├── progress.tsx        # プログレスバー
│       ├── result-table.tsx    # 結果テーブル
│       ├── summary.tsx         # サマリー
│       └── menu.tsx            # メニュー
├── scripts/
│   └── batch-convert.ts        # 一括変換スクリプト
├── test/
│   └── converter.test.ts       # テストケース
├── dist/                       # ビルド済みバイナリ
├── test-skill/                 # テスト用スキル
├── package.json
└── README.md
```

## テスト実行

```bash
bun test
```

## 変換例

### 入力（SKILL.md）

```yaml
---
name: database-query-helper
description: データベースクエリの作成と最適化をサポート。SQL、MongoDB、PostgreSQL に対応し、クエリの最適化、スキーマ分析、パフォーマンスのヒントを提供します。
---

# データベースクエリヘルパー
...
```

### 出力（POWER.md）

```yaml
---
name: database-query-helper
displayName: Database Query Helper
description: データベースクエリの作成と最適化をサポート。SQL、MongoDB、PostgreSQL に対応し、クエリの最適化、スキーマ分析、パフォーマンスのヒントを提供します。
keywords:
  - データベースクエリの作成と最適化をサポート
author: Claude Code Skills
---

# データベースクエリヘルパー
...
```

## 次のステップ

- [ ] skillsmp.com API の実装確認と統合テスト
- [ ] エラーハンドリングの強化
- [ ] npm パッケージ化
- [ ] GitHub Actions による自動テスト
- [ ] 逆変換機能（Powers → Skills）の実装
