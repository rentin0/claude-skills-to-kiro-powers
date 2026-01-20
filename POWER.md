---
name: claude-skills-to-kiro-powers
displayName: Claude Code Skills to Kiro Powers 変換ツール
description: Claude Code Skills を Kiro Powers に自動変換するツール。skill.zip をアップロードすると、POWER.md に変換し、日本語説明ファイルも自動生成します。
keywords:
  - Claude Code Skills
  - Kiro Powers
  - 変換
  - 自動化
  - スキル管理
  - skill
  - power
  - convert
author: rentin0
mcpServers:
  claude-skills-to-kiro-powers:
    command: npx
    args:
      - "-y"
      - "git+https://github.com/rentin0/claude-skills-to-kiro-powers.git"
    env:
      FASTMCP_LOG_LEVEL: ERROR
---

# Claude Code Skills to Kiro Powers 変換ツール

Claude Code Skills を Kiro Powers に自動変換するための統合ツールです。

## 機能

### 🔄 自動変換
- SKILL.md を POWER.md に自動変換
- frontmatter の intelligent マッピング
- 補助ファイルの自動コピー

### 📦 ZIP ファイル対応
- skill.zip をアップロードすると自動解凍
- MCP サーバーに自動的に処理を委譲

### 🌍 日本語対応
- 自動生成される `.jp-description.md` ファイル
- 日本人が読みやすい説明文
- Kiro のコンテキストを汚染しない設計

### 🎨 豪華な UI
- TUI インターフェース（Ink + React）
- アニメーション付きステータス表示
- リアルタイムプログレス表示

### 🤖 MCP 統合
- Model Context Protocol サーバー
- Claude Code との連携
- Kiro IDE との統合

## 使用方法

### 1. CLI での使用

```bash
# ローカルのスキルを変換
bun run src/cli.ts --convert ./my-skill

# TUI 版で実行
bun run src/cli-tui.tsx --convert ./my-skill

# インタラクティブ版
bun run src/cli-interactive.tsx
```

### 2. MCP サーバーでの使用

```bash
# MCP サーバーを起動
bun run dev:mcp
```

Claude Code や Kiro IDE から MCP ツールを使用して変換を実行します。

### 3. ZIP ファイルのアップロード

1. skill.zip ファイルを準備
2. MCP ツール `convert_skill_from_zip` を実行
3. POWER.md が自動生成される

### 4. 日本語説明ファイルの生成

1. POWER.md が生成された後、Claude に以下を指示：
   ```
   このPOWER.mdの内容を日本語に翻訳して、
   {skill-name}.jp-description.md という形式で
   日本語説明ファイルを作成してください。
   ```
2. Claude が翻訳した内容を MCP ツール `translate_to_japanese` に渡す
3. 日本語説明ファイルが自動生成される

## 変換ルール

| Claude Code | Kiro Power |
|-------------|-----------|
| `name` | `name` |
| `description` | `description` |
| - | `displayName` (name から自動生成) |
| - | `keywords` (description から自動抽出) |
| - | `author` (デフォルト: "Claude Code Skills") |

## 出力ファイル

変換後、以下のファイルが生成されます：

```
~/.kiro/powers/{skill-name}/
├── POWER.md                    # 変換済みの Power ファイル
├── {skill-name}.jp-description.md  # 日本語説明（Kiro が読まない）
├── REFERENCE.md                # 参考資料（あれば）
├── scripts/                    # スクリプト（あれば）
└── resources/                  # リソース（あれば）
```

## 日本語説明ファイルについて

`.jp-description.md` ファイルは以下の特徴があります：

- **Kiro が読まない** - ファイル名の `.jp-` プレフィックスにより、Kiro のコンテキスト読み込みから除外
- **日本人向け** - 日本語で詳細な説明を記載
- **参考用** - ユーザーが手動で参照するための補助ファイル

## 技術スタック

- **言語**: TypeScript + Bun
- **UI**: Ink + React
- **MCP**: @modelcontextprotocol/sdk
- **パース**: YAML

## セットアップ

詳細は [MCP_SETUP.md](./MCP_SETUP.md) を参照してください。

## 次のステップ

- [ ] skillsmp.com API の実装確認
- [ ] エラーハンドリングの強化
- [ ] npm パッケージ化
- [ ] GitHub Actions 統合
- [ ] 逆変換機能（Powers → Skills）の実装
