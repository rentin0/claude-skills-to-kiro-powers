# Claude Code Skills to Kiro Powers CLI

Claude Code Skills を Kiro Powers に変換する CLI ツール（MVP）

## 機能

- 📥 **skillsmp.com からのインストール** - Claude Code Skills を直接ダウンロード
- 🔄 **自動変換** - SKILL.md を POWER.md に変換
- 📦 **補助ファイル対応** - REFERENCE.md、scripts、resources をコピー
- 🏠 **ホームディレクトリ対応** - `~/.kiro/powers/` に自動配置
- 🔗 **一括変換** - 複数のスキルを同時に変換

## インストール

```bash
bun install
```

## 使用方法

### skillsmp.com からスキルをインストール・変換

```bash
bun run src/cli.ts --install database-query-helper
```

### ローカルのスキルを変換

```bash
bun run src/cli.ts --convert ./my-skill
```

### 出力先を指定

```bash
bun run src/cli.ts --convert ./my-skill --output ./output/my-power
```

### 複数のスキルを一括変換

```bash
bun run scripts/batch-convert.ts database-query-helper code-review-assistant
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
│   ├── cli.ts          # CLI エントリーポイント
│   ├── converter.ts    # 変換ロジック
│   ├── downloader.ts   # ダウンロードロジック
│   └── utils.ts        # ユーティリティ関数
├── scripts/
│   └── batch-convert.ts # 一括変換スクリプト
├── test/
│   └── converter.test.ts # テストケース
├── test-skill/         # テスト用スキル
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
