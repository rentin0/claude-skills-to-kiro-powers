import { readFileSync, writeFileSync, mkdirSync, cpSync } from "fs";
import { join, dirname, basename } from "path";
import { parse, stringify } from "yaml";
import { expandHome } from "./utils";

interface SkillFrontmatter {
  name: string;
  description: string;
  "allowed-tools"?: string | string[];
  model?: string;
  context?: string;
  agent?: string;
  hooks?: Record<string, unknown>;
  "user-invocable"?: boolean;
}

interface PowerFrontmatter {
  name: string;
  displayName: string;
  description: string;
  keywords?: string[];
  author?: string;
}

export class SkillsConverter {
  /**
   * Claude Code Skill を Kiro Power に変換
   */
  async convert(skillPath: string, outputDir: string): Promise<void> {
    const expandedSkillPath = expandHome(skillPath);
    const expandedOutputDir = expandHome(outputDir);

    // SKILL.md を読み込み
    const skillFile = join(expandedSkillPath, "SKILL.md");
    const skillContent = readFileSync(skillFile, "utf-8");

    // frontmatter と本体を分離
    const { frontmatter, body } = this.parseFrontmatter(skillContent);

    // frontmatter を変換
    const powerFrontmatter = this.convertFrontmatter(frontmatter);

    // POWER.md を生成
    const powerContent = this.generatePowerMd(powerFrontmatter, body);

    // 出力ディレクトリを作成
    mkdirSync(expandedOutputDir, { recursive: true });

    // POWER.md を書き込み
    writeFileSync(join(expandedOutputDir, "POWER.md"), powerContent);

    // 補助ファイルをコピー
    this.copySupportingFiles(expandedSkillPath, expandedOutputDir);
  }

  /**
   * frontmatter と本体を分離
   */
  private parseFrontmatter(content: string): {
    frontmatter: SkillFrontmatter;
    body: string;
  } {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!match) {
      throw new Error("frontmatter が見つかりません");
    }

    const frontmatterStr = match[1];
    const body = match[2];

    const frontmatter = parse(frontmatterStr) as SkillFrontmatter;

    return { frontmatter, body };
  }

  /**
   * Claude Code frontmatter を Kiro Power frontmatter に変換
   */
  private convertFrontmatter(
    skillFrontmatter: SkillFrontmatter
  ): PowerFrontmatter {
    const { name, description } = skillFrontmatter;

    if (!name || !description) {
      throw new Error("name と description は必須です");
    }

    // displayName を生成（name をキャメルケースから人間が読める形に）
    const displayName = this.generateDisplayName(name);

    // keywords を description から抽出
    const keywords = this.extractKeywords(description);

    return {
      name,
      displayName,
      description,
      keywords,
      author: "Claude Code Skills",
    };
  }

  /**
   * name からdisplayName を生成
   */
  private generateDisplayName(name: string): string {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  /**
   * description からキーワードを抽出
   */
  private extractKeywords(description: string): string[] {
    // 最初の文から主要な単語を抽出
    const firstSentence = description.split("。")[0] || description.split(".")[0];
    const words = firstSentence
      .toLowerCase()
      .split(/[\s、，,]+/)
      .filter((word) => word.length > 2 && !this.isStopWord(word) && !/^[a-z]+$/.test(word));

    // 重複を除去して最大5個まで
    const uniqueWords = [...new Set(words)];
    return uniqueWords.slice(0, 5);
  }

  /**
   * ストップワードかどうかを判定
   */
  private isStopWord(word: string): boolean {
    const stopWords = [
      "help",
      "with",
      "from",
      "that",
      "this",
      "your",
      "when",
      "how",
      "what",
      "where",
      "which",
      "を",
      "に",
      "は",
      "が",
      "で",
      "も",
      "や",
      "など",
      "および",
      "および",
    ];
    return stopWords.includes(word);
  }

  /**
   * POWER.md を生成
   */
  private generatePowerMd(
    frontmatter: PowerFrontmatter,
    body: string
  ): string {
    const frontmatterStr = stringify(frontmatter);
    return `---\n${frontmatterStr}---\n${body}`;
  }

  /**
   * 補助ファイルをコピー
   */
  private copySupportingFiles(
    skillPath: string,
    outputPath: string
  ): void {
    const supportingFiles = ["REFERENCE.md", "scripts", "resources"];

    for (const file of supportingFiles) {
      const sourcePath = join(skillPath, file);
      const destPath = join(outputPath, file);

      try {
        cpSync(sourcePath, destPath, { recursive: true });
      } catch {
        // ファイルが存在しない場合はスキップ
      }
    }
  }
}
