# Claude Code Skills to Kiro Powers MCP サーバー セットアップガイド

このドキュメントでは、MCP サーバーを Kiro IDE に統合する方法を説明します。

## 📋 概要

Claude Code Skills to Kiro Powers MCP サーバーは、Claude Code Skills を Kiro Powers に変換するための MCP インターフェースを提供します。

## 🚀 セットアップ手順

### 1. プロジェクトをビルド

```bash
bun run build
```

### 2. ユーザーレベルの mcp.json を編集

ユーザーレベルの MCP 設定ファイルを編集します：

```bash
# macOS/Linux
nano ~/.kiro/settings/mcp.json

# または、エディタで開く
code ~/.kiro/settings/mcp.json
```

### 3. MCP サーバー設定を追加

以下の設定を `mcpServers` オブジェクトに追加します：

```json
{
  "mcpServers": {
    "claude-skills-to-kiro-powers": {
      "command": "bun",
      "args": [
        "run",
        "/path/to/claude-skills-to-kiro-powers/src/mcp-server.ts"
      ],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": [
        "convert_skill",
        "download_and_convert_skill",
        "list_available_skills"
      ]
    }
  }
}
```

**注意:** `/path/to/claude-skills-to-kiro-powers` をプロジェクトの実際のパスに置き換えてください。

### 4. Kiro IDE を再起動

MCP サーバーの設定を反映させるため、Kiro IDE を再起動します。

## 🛠️ 利用可能なツール

### 1. convert_skill

ローカルのスキルファイルを Kiro Power に変換します。

**パラメータ:**
- `skill_path` (必須): 変換するスキルのディレクトリパス
- `output_dir` (オプション): 出力先ディレクトリ

**例:**
```
convert_skill(skill_path="./my-skill", output_dir="~/.kiro/powers/my-skill")
```

### 2. download_and_convert_skill

skillsmp.com からスキルをダウンロードして、Kiro Power に変換します。

**パラメータ:**
- `skill_name` (必須): ダウンロードするスキルの名前
- `output_dir` (オプション): 出力先ディレクトリ

**例:**
```
download_and_convert_skill(skill_name="database-query-helper")
```

### 3. list_available_skills

skillsmp.com で利用可能なスキルの一覧を取得します（API 実装待ち）。

**パラメータ:**
- `query` (オプション): 検索クエリ

## 📝 使用例

### Claude Code で使用

```
Claude Code に以下のように指示します：

"Claude Code Skills の database-query-helper スキルを Kiro Power に変換してください"

Claude Code が MCP ツールを使用して自動的に変換を実行します。
```

### Kiro IDE で使用

Kiro IDE の MCP ツールパネルから、以下のツールを実行できます：

1. **convert_skill** - ローカルのスキルを変換
2. **download_and_convert_skill** - skillsmp.com からダウンロード・変換
3. **list_available_skills** - 利用可能なスキルを検索

## 🔧 トラブルシューティング

### MCP サーバーが起動しない

1. Bun がインストールされているか確認：
   ```bash
   bun --version
   ```

2. プロジェクトが正しくビルドされているか確認：
   ```bash
   bun run build
   ```

3. mcp.json のパスが正しいか確認

### ツールが実行されない

1. Kiro IDE を再起動
2. MCP サーバーの接続状態を確認
3. ログを確認：
   ```bash
   bun run dev:mcp
   ```

## 📚 参考資料

- [MCP 仕様](https://modelcontextprotocol.io/)
- [Kiro IDE MCP ドキュメント](https://kiro.dev/docs/mcp)
- [Claude Code Skills ドキュメント](https://docs.claude.com/en/docs/claude-code/skills)

## 🎯 次のステップ

- [ ] skillsmp.com API の実装確認
- [ ] エラーハンドリングの強化
- [ ] ログ機能の追加
- [ ] キャッシング機能の実装
