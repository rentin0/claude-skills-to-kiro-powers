/**
 * 日本語説明ファイル生成モジュール
 * 
 * POWER.md から日本語説明ファイル（.jp-description.md）を生成します。
 * このファイルは Kiro が読まないように設計されています。
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { parse } from "yaml";

interface PowerMetadata {
  name: string;
  displayName: string;
  description: string;
  keywords?: string[];
  author?: string;
}

export class JpDescriptionGenerator {
  /**
   * 日本語説明ファイルを生成
   */
  generateJpDescription(powerPath: string): void {
    const powerMdPath = join(powerPath, "POWER.md");
    const jpDescriptionPath = join(powerPath, `${this.extractSkillName(powerPath)}.jp-description.md`);

    // POWER.md を読み込み
    const powerContent = readFileSync(powerMdPath, "utf-8");
    const { frontmatter, body } = this.parseFrontmatter(powerContent);

    // 日本語説明ファイルを生成
    const jpDescription = this.generateContent(frontmatter, body);

    // ファイルに書き込み
    writeFileSync(jpDescriptionPath, jpDescription);
  }

  /**
   * frontmatter と本体を分離
   */
  private parseFrontmatter(content: string): {
    frontmatter: PowerMetadata;
    body: string;
  } {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      throw new Error("frontmatter が見つかりません");
    }

    const frontmatterStr = match[1];
    const body = match[2];

    const frontmatter = parse(frontmatterStr) as PowerMetadata;

    return { frontmatter, body };
  }

  /**
   * スキル名を抽出
   */
  private extractSkillName(powerPath: string): string {
    return powerPath.split("/").pop() || "skill";
  }

  /**
   * 日本語説明ファイルの内容を生成
   */
  private generateContent(frontmatter: PowerMetadata, body: string): string {
    const content = `# ${frontmatter.displayName} - 日本語説明

> このファイルは Kiro のコンテキスト読み込みから除外されています。
> 日本人ユーザーが参考用として使用してください。

## 概要

**スキル名**: \`${frontmatter.name}\`  
**表示名**: ${frontmatter.displayName}  
**作成者**: ${frontmatter.author || "不明"}

## 説明

${frontmatter.description}

## キーワード

${frontmatter.keywords ? frontmatter.keywords.map((k) => `- ${k}`).join("\n") : "なし"}

## 詳細情報

${body}

---

**注記**: このファイルは自動生成されています。手動での編集は推奨されません。
`;

    return content;
  }
}
