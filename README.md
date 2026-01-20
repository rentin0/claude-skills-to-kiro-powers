# Claude Code Skills to Kiro Powers CLI

Claude Code Skills を Kiro Powers に変換する CLI ツール（MVP）

## 機能

- 📥 **skillsmp.com からのインストール** - Claude Code Skills を直接ダウンロード
- 🔄 **自動変換** - SKILL.md を POWER.md に変換
- 📦 **補助ファイル対応** - REFERENCE.md、scripts、resources をコピー
- 🏠 **ホームディレクトリ対応** - `~/.kiro/powers/` に自動配置
- 🔗 **一括変換** - 複数のスキルを同時に変換
- 🎨 **豪華な TUI** - Ink を使用した美しいターミナルインターフェース
- 🤖 **MCP サーバー** - Model Context Protocol インターフェース

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

### 4. MCP サーバー

Claude Code や Kiro IDE から MCP インターフェース経由で使用できます。

詳細は [MCP_SETUP.md](./MCP_SETUP.md) を参照してください。

```bash
# MCP サーバーを起動
bun run dev:mcp
```

### 5. 複数のスキルを一括変換

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

# MCP サーバー
bun dist/mcp-server.js
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
- [x] npm パッケージ化
- [ ] GitHub Actions による自動テスト
- [ ] 逆変換機能（Powers → Skills）の実装

## Kiro Power として使用する方法

このツール自体を Kiro Power としてインストールして使用できます。

### インストール方法

1. Kiro IDE で Powers パネルを開く
2. 「Import from URL」を選択
3. 以下の GitHub リポジトリ URL を入力：

```
https://github.com/rentin0/claude-skills-to-kiro-powers
```

Kiro が自動的にリポジトリ内の `POWER.md` を検出してインストールします。

または、手動でインストールする場合：

```bash
# ~/.kiro/powers/ ディレクトリに配置
mkdir -p ~/.kiro/powers/claude-skills-to-kiro-powers

# POWER.md と mcp.json をダウンロード
curl -o ~/.kiro/powers/claude-skills-to-kiro-powers/POWER.md \
  https://raw.githubusercontent.com/rentin0/claude-skills-to-kiro-powers/powers/POWER.md
curl -o ~/.kiro/powers/claude-skills-to-kiro-powers/mcp.json \
  https://raw.githubusercontent.com/rentin0/claude-skills-to-kiro-powers/powers/mcp.json
```

### 使用可能なツール

Power をインストールすると、以下の MCP ツールが使用可能になります：

| ツール名 | 説明 |
|---------|------|
| `convert_skill` | ローカルの SKILL.md を POWER.md に変換 |
| `download_and_convert_skill` | skillsmp.com からスキルをダウンロードして変換 |
| `list_available_skills` | 利用可能なスキル一覧を取得 |

### 使用例

Kiro のチャットで以下のように指示できます：

```
# ローカルのスキルを変換
「./my-skill ディレクトリのスキルを Power に変換して」

# skillsmp.com からインストール
「database-query-helper スキルをダウンロードして Power に変換して」

# 利用可能なスキル一覧を確認
「利用可能な Claude Code Skills を教えて」
```

### 手動で mcp.json に追加する場合

```json
{
  "mcpServers": {
    "claude-skills-to-kiro-powers": {
      "command": "npx",
      "args": ["-y", "git+https://github.com/rentin0/claude-skills-to-kiro-powers.git"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```
