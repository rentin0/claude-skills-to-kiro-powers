import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { expandHome } from "./utils";

interface SkillMetadata {
  name: string;
  description: string;
  content: string;
  supportingFiles?: Record<string, string>;
}

export class SkillsDownloader {
  // skillsmp.com の API エンドポイント
  private readonly SKILLSMP_API = "https://api.skillsmp.com/v1";
  private readonly CACHE_DIR = expandHome("~/.cache/skills-to-powers");

  /**
   * skillsmp.com からスキルをダウンロード
   */
  async downloadSkill(skillName: string): Promise<string> {
    console.log(`🔍 skillsmp.com から "${skillName}" を検索中...`);

    try {
      // skillsmp.com API からスキルメタデータを取得
      const skillData = await this.fetchSkillData(skillName);

      // キャッシュディレクトリに保存
      const skillPath = await this.saveSkillLocally(skillName, skillData);

      return skillPath;
    } catch (error) {
      throw new Error(
        `スキルのダウンロードに失敗しました: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  /**
   * skillsmp.com API からスキルデータを取得
   * 
   * API エンドポイント: GET /v1/skills/{skillName}
   * レスポンス形式:
   * {
   *   "name": "skill-name",
   *   "description": "スキルの説明",
   *   "content": "SKILL.md の内容",
   *   "supportingFiles": {
   *     "REFERENCE.md": "参考資料",
   *     "scripts/setup.sh": "セットアップスクリプト"
   *   }
   * }
   */
  private async fetchSkillData(skillName: string): Promise<SkillMetadata> {
    const url = `${this.SKILLSMP_API}/skills/${skillName}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `API エラー: ${response.status} - ${response.statusText}`
        );
      }

      const data = (await response.json()) as SkillMetadata;

      if (!data.name || !data.content) {
        throw new Error("スキルデータが不完全です");
      }

      return data;
    } catch (error) {
      // API が利用できない場合は、ユーザーに情報を提供
      if (error instanceof Error && error.message.includes("API エラー")) {
        throw error;
      }
      throw new Error(
        `skillsmp.com への接続に失敗しました。ローカルのスキルを使用してください。`
      );
    }
  }

  /**
   * スキルをローカルに保存
   */
  private async saveSkillLocally(
    skillName: string,
    skillData: SkillMetadata
  ): Promise<string> {
    // キャッシュディレクトリを作成
    mkdirSync(this.CACHE_DIR, { recursive: true });

    const skillPath = join(this.CACHE_DIR, skillName);
    mkdirSync(skillPath, { recursive: true });

    // SKILL.md を保存
    writeFileSync(join(skillPath, "SKILL.md"), skillData.content);

    // 補助ファイルがあれば保存
    if (skillData.supportingFiles) {
      for (const [fileName, content] of Object.entries(
        skillData.supportingFiles
      )) {
        const filePath = join(skillPath, fileName);
        // ディレクトリ構造を作成
        mkdirSync(join(skillPath, fileName.split("/").slice(0, -1).join("/")), {
          recursive: true,
        });
        writeFileSync(filePath, content);
      }
    }

    console.log(`✅ スキルをキャッシュに保存: ${skillPath}`);

    return skillPath;
  }
}
