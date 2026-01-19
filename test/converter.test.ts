import { describe, it, expect } from "bun:test";
import { SkillsConverter } from "../src/converter";
import { readFileSync } from "fs";
import { join } from "path";

describe("SkillsConverter", () => {
  it("SKILL.md を POWER.md に変換できる", async () => {
    const converter = new SkillsConverter();
    const skillPath = "./test-skill";
    const outputDir = "./test-output-test";

    await converter.convert(skillPath, outputDir);

    // POWER.md が生成されたか確認
    const powerMdPath = join(outputDir, "POWER.md");
    const content = readFileSync(powerMdPath, "utf-8");

    expect(content).toContain("name: database-query-helper");
    expect(content).toContain("displayName: Database Query Helper");
    expect(content).toContain("author: Claude Code Skills");
  });

  it("frontmatter が正しく変換される", async () => {
    const converter = new SkillsConverter();
    const skillPath = "./test-skill";
    const outputDir = "./test-output-test2";

    await converter.convert(skillPath, outputDir);

    const powerMdPath = join(outputDir, "POWER.md");
    const content = readFileSync(powerMdPath, "utf-8");

    // frontmatter の検証
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    expect(frontmatterMatch).toBeTruthy();

    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      expect(frontmatter).toContain("name:");
      expect(frontmatter).toContain("displayName:");
      expect(frontmatter).toContain("description:");
      expect(frontmatter).toContain("keywords:");
      expect(frontmatter).toContain("author:");
    }
  });

  it("Markdown 本体が保持される", async () => {
    const converter = new SkillsConverter();
    const skillPath = "./test-skill";
    const outputDir = "./test-output-test3";

    await converter.convert(skillPath, outputDir);

    const powerMdPath = join(outputDir, "POWER.md");
    const content = readFileSync(powerMdPath, "utf-8");

    // 元のコンテンツが保持されているか確認
    expect(content).toContain("# データベースクエリヘルパー");
    expect(content).toContain("## 対応データベース");
    expect(content).toContain("## 主な機能");
  });
});
