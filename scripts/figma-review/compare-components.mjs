import fetch from "node-fetch";
import dotenv from "dotenv";
import { createInterface } from "readline";
import { writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const API_BASE = "https://api.figma.com/v1";

// ---------------------------------------------------------------------------
// Main library file keys
// ---------------------------------------------------------------------------

const LIBRARIES = {
  desktop: {
    name: "Mística Desktop",
    fileKey: "DSWhPLyJzbliP1fBrLxDUR",
  },
  mobile: {
    name: "Mística Mobile",
    fileKey: "WCkDDzlXE16R6yXaljxddj",
  },
};

// ---------------------------------------------------------------------------
// Interactive prompt
// ---------------------------------------------------------------------------

function createPrompt() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const ask = (question) =>
    new Promise((resolve) => rl.question(question, resolve));
  const close = () => rl.close();
  return { ask, close };
}

// ---------------------------------------------------------------------------
// Extract file key from a Figma URL or return raw key
// ---------------------------------------------------------------------------

function extractFileKey(input) {
  const trimmed = input.trim();

  // If it looks like a URL, parse it
  if (trimmed.startsWith("http")) {
    const urlObj = new URL(trimmed);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    // Check for /branch/BRANCH_KEY pattern first
    // e.g. /design/FILE_KEY/branch/BRANCH_KEY/Title
    const branchIndex = pathParts.indexOf("branch");
    if (branchIndex !== -1 && branchIndex + 1 < pathParts.length) {
      return pathParts[branchIndex + 1];
    }

    // Otherwise extract the file key
    const typeIndex = pathParts.findIndex(
      (p) => p === "design" || p === "file",
    );
    if (typeIndex !== -1 && typeIndex + 1 < pathParts.length) {
      return pathParts[typeIndex + 1];
    }
    throw new Error(`Could not extract file key from URL: ${trimmed}`);
  }

  // Otherwise treat it as a raw file key
  return trimmed;
}

// ---------------------------------------------------------------------------
// Figma API helpers
// ---------------------------------------------------------------------------

async function fetchFigmaFile(fileKey) {
  const url = `${API_BASE}/files/${fileKey}?geometry=paths&plugin_data=shared`;
  console.log(`  Fetching file ${fileKey}...`);
  const res = await fetch(url, {
    headers: { "X-Figma-Token": FIGMA_TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API error (${res.status}): ${text}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Component extraction – walks the document tree
// ---------------------------------------------------------------------------

function extractComponents(document) {
  const components = new Map();

  function walk(node, path = [], parentId = null) {
    const currentPath = [...path, node.name];

    if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
      const key = node.id;
      components.set(key, {
        id: node.id,
        name: node.name,
        type: node.type,
        path: currentPath.join(" / "),
        description: node.description || "",
        // Track parent COMPONENT_SET for variants
        ...(node.type === "COMPONENT" && parentId && { parentId }),
        ...(node.type === "COMPONENT_SET" && {
          variantCount: (node.children || []).filter(
            (c) => c.type === "COMPONENT",
          ).length,
        }),
        ...(node.componentPropertyDefinitions && {
          properties: Object.keys(node.componentPropertyDefinitions),
        }),
        childCount: (node.children || []).length,
      });
    }

    // Don't recurse into COMPONENT children (variants are counted above)
    if (node.type !== "COMPONENT") {
      const nextParentId = node.type === "COMPONENT_SET" ? node.id : parentId;
      for (const child of node.children || []) {
        walk(child, currentPath, nextParentId);
      }
    }
  }

  walk(document);
  return components;
}

// ---------------------------------------------------------------------------
// Comparison — matches by node ID first, then detects renames vs true adds/removes
// ---------------------------------------------------------------------------

function detectChanges(mainComp, branchComp) {
  const changes = [];

  if (mainComp.name !== branchComp.name) {
    changes.push({
      field: "name",
      from: mainComp.name,
      to: branchComp.name,
    });
  }
  if (mainComp.path !== branchComp.path) {
    changes.push({
      field: "path",
      from: mainComp.path,
      to: branchComp.path,
    });
  }
  if (mainComp.description !== branchComp.description) {
    changes.push({
      field: "description",
      from: mainComp.description,
      to: branchComp.description,
    });
  }
  if (mainComp.childCount !== branchComp.childCount) {
    changes.push({
      field: "childCount",
      from: mainComp.childCount,
      to: branchComp.childCount,
    });
  }
  if (mainComp.variantCount !== branchComp.variantCount) {
    changes.push({
      field: "variantCount",
      from: mainComp.variantCount,
      to: branchComp.variantCount,
    });
  }

  const mainProps = (mainComp.properties || []).sort().join(",");
  const branchProps = (branchComp.properties || []).sort().join(",");
  if (mainProps !== branchProps) {
    changes.push({
      field: "properties",
      from: mainComp.properties || [],
      to: branchComp.properties || [],
    });
  }

  return changes;
}

function compareComponents(mainComponents, branchComponents) {
  const added = [];
  const removed = [];
  const modified = [];
  const renamed = [];
  const unchanged = [];

  // Step 1: Match by node ID (Figma preserves IDs even on rename)
  const matchedMainIds = new Set();
  const matchedBranchIds = new Set();
  const variantRenames = new Map(); // parentId → [{main, branch}, ...]

  for (const [id, mainComp] of mainComponents) {
    const branchComp = branchComponents.get(id);
    if (!branchComp) continue;

    matchedMainIds.add(id);
    matchedBranchIds.add(id);

    const changes = detectChanges(mainComp, branchComp);

    if (changes.length === 0) {
      unchanged.push(mainComp);
    } else {
      const hasNameChange = changes.some((c) => c.field === "name");
      // Filter out path changes — path is derived from name, so showing both is redundant
      const filteredChanges = changes.filter((c) => c.field !== "path");
      if (hasNameChange) {
        // If this is a variant inside a COMPONENT_SET, don't list it individually —
        // we'll consolidate at the parent level as a property rename
        if (mainComp.type === "COMPONENT" && mainComp.parentId) {
          if (!variantRenames.has(mainComp.parentId)) {
            variantRenames.set(mainComp.parentId, []);
          }
          variantRenames.get(mainComp.parentId).push({
            main: mainComp,
            branch: branchComp,
          });
        } else {
          renamed.push({
            main: mainComp,
            branch: branchComp,
            changes: filteredChanges,
          });
        }
      } else {
        modified.push({
          main: mainComp,
          branch: branchComp,
          changes,
        });
      }
    }
  }

  // Step 2: Consolidate variant renames into property renames at the parent level
  for (const [parentId, variants] of variantRenames) {
    const mainParent = mainComponents.get(parentId);
    const branchParent = branchComponents.get(parentId);

    // Detect property renames by comparing the set of property names across all variants
    // Variant names look like "Prop1=Val1, Prop2=Val2"
    const allMainProps = new Set();
    const allBranchProps = new Set();
    const valueChanges = new Set(); // track property=value changes

    for (const { main, branch } of variants) {
      const mainPairs = main.name.split(", ");
      const branchPairs = branch.name.split(", ");

      for (const p of mainPairs) allMainProps.add(p.split("=")[0]);
      for (const p of branchPairs) allBranchProps.add(p.split("=")[0]);

      // Track value changes for properties that exist in both
      for (const mp of mainPairs) {
        const [prop, val] = mp.split("=");
        if (allBranchProps.has(prop)) {
          const branchVal = branchPairs.find((bp) => bp.startsWith(prop + "="));
          if (branchVal && branchVal !== mp) {
            valueChanges.add(prop);
          }
        }
      }
    }

    // Properties only in main → renamed from; only in branch → renamed to
    const onlyInMain = [...allMainProps].filter((p) => !allBranchProps.has(p));
    const onlyInBranch = [...allBranchProps].filter(
      (p) => !allMainProps.has(p),
    );

    const changes = [];

    if (onlyInMain.length > 0 && onlyInBranch.length > 0) {
      // Match renames: pair up by order of appearance
      const pairs = Math.min(onlyInMain.length, onlyInBranch.length);
      for (let i = 0; i < pairs; i++) {
        changes.push({
          field: "property renamed",
          from: onlyInMain[i],
          to: onlyInBranch[i],
        });
      }
      // Any remaining unmatched
      for (let i = pairs; i < onlyInMain.length; i++) {
        changes.push({
          field: "property removed",
          from: onlyInMain[i],
          to: "",
        });
      }
      for (let i = pairs; i < onlyInBranch.length; i++) {
        changes.push({
          field: "property added",
          from: "",
          to: onlyInBranch[i],
        });
      }
    } else if (onlyInMain.length > 0) {
      for (const p of onlyInMain) {
        changes.push({ field: "property removed", from: p, to: "" });
      }
    } else if (onlyInBranch.length > 0) {
      for (const p of onlyInBranch) {
        changes.push({ field: "property added", from: "", to: p });
      }
    }

    // If property names are identical but values changed, find the common change
    if (changes.length === 0 && variants.length > 0) {
      // Parse all variants to find which prop=value pairs changed consistently
      const valueDiffs = new Map(); // prop → { from: Set, to: Set }

      for (const { main, branch } of variants) {
        const mainPairs = new Map(
          main.name.split(", ").map((s) => {
            const eq = s.indexOf("=");
            return [s.substring(0, eq), s.substring(eq + 1)];
          }),
        );
        const branchPairs = new Map(
          branch.name.split(", ").map((s) => {
            const eq = s.indexOf("=");
            return [s.substring(0, eq), s.substring(eq + 1)];
          }),
        );

        for (const [prop, mainVal] of mainPairs) {
          const branchVal = branchPairs.get(prop);
          if (branchVal !== undefined && branchVal !== mainVal) {
            if (!valueDiffs.has(prop)) {
              valueDiffs.set(prop, { from: new Set(), to: new Set() });
            }
            valueDiffs.get(prop).from.add(mainVal);
            valueDiffs.get(prop).to.add(branchVal);
          }
        }
      }

      for (const [prop, diff] of valueDiffs) {
        changes.push({
          field: "value changed",
          from: `${prop}: ${[...diff.from].join(", ")}`,
          to: `${prop}: ${[...diff.to].join(", ")}`,
        });
      }

      // Fallback if no diffs detected
      if (changes.length === 0) {
        changes.push({
          field: "variant values changed",
          from: `${variants.length} variants`,
          to: "",
        });
      }
    }

    renamed.push({
      main: mainParent || variants[0].main,
      branch: branchParent || variants[0].branch,
      changes,
    });
  }

  // Step 3: Unmatched items — check if they're variants of existing component sets
  // If a variant's parent COMPONENT_SET exists in both files, it's a variant
  // change (modification of the parent), not a truly new/removed component.
  const variantChanges = new Map(); // parentId → { addedVariants: [], removedVariants: [] }

  for (const [id, mainComp] of mainComponents) {
    if (matchedMainIds.has(id)) continue;
    if (
      mainComp.type === "COMPONENT" &&
      mainComp.parentId &&
      branchComponents.has(mainComp.parentId)
    ) {
      if (!variantChanges.has(mainComp.parentId)) {
        variantChanges.set(mainComp.parentId, {
          addedVariants: [],
          removedVariants: [],
        });
      }
      variantChanges.get(mainComp.parentId).removedVariants.push(mainComp);
    } else {
      removed.push(mainComp);
    }
  }

  for (const [id, branchComp] of branchComponents) {
    if (matchedBranchIds.has(id)) continue;
    if (
      branchComp.type === "COMPONENT" &&
      branchComp.parentId &&
      mainComponents.has(branchComp.parentId)
    ) {
      if (!variantChanges.has(branchComp.parentId)) {
        variantChanges.set(branchComp.parentId, {
          addedVariants: [],
          removedVariants: [],
        });
      }
      variantChanges.get(branchComp.parentId).addedVariants.push(branchComp);
    } else {
      added.push(branchComp);
    }
  }

  // Merge variant changes into the modified list
  for (const [parentId, changes] of variantChanges) {
    const mainParent = mainComponents.get(parentId);
    const branchParent = branchComponents.get(parentId);

    // Find or create a modified entry for this parent
    const existing = modified.find((m) => m.main.id === parentId);
    const entry = existing || {
      main: mainParent,
      branch: branchParent,
      changes: [],
    };

    if (changes.addedVariants.length > 0) {
      entry.changes.push({
        field: "addedVariants",
        from: [],
        to: changes.addedVariants.map((v) => v.name),
      });
    }
    if (changes.removedVariants.length > 0) {
      entry.changes.push({
        field: "removedVariants",
        from: changes.removedVariants.map((v) => v.name),
        to: [],
      });
    }

    if (!existing) {
      modified.push(entry);
    }
  }

  return { added, removed, modified, renamed, unchanged };
}

// ---------------------------------------------------------------------------
// Report generation — groups variants by page and component set
// ---------------------------------------------------------------------------

// Extract page name and component set name from a path like
// "Document / PageName / ComponentSetName / VariantName"
function parsePath(path) {
  const parts = path.split(" / ");
  const page = parts[1] || "Unknown page";
  const componentSet = parts[2] || "Unknown component";
  return { page, componentSet };
}

// Given a list of variant names like ["Prop1=A, Prop2=X", "Prop1=B, Prop2=X"],
// find the common properties (same value across all variants) — these are the
// distinguishing factor (e.g. "Theme context=Negative" for all new variants).
// Show those as the summary, since they explain *why* these variants were added.
function summarizeVariantDiffs(variantNames) {
  const parsed = variantNames.map((name) => {
    const pairs = new Map();
    for (const segment of name.split(", ")) {
      const eqIdx = segment.indexOf("=");
      if (eqIdx !== -1) {
        pairs.set(segment.substring(0, eqIdx), segment.substring(eqIdx + 1));
      } else {
        pairs.set(segment, "");
      }
    }
    return pairs;
  });

  if (parsed.length === 0) return "";

  // Find properties with a single constant value across all variants
  const allProps = [...parsed[0].keys()];
  const constant = [];

  for (const prop of allProps) {
    const values = new Set(parsed.map((p) => p.get(prop) || ""));
    if (values.size === 1) {
      constant.push(`${prop}=${[...values][0]}`);
    }
  }

  if (constant.length > 0) {
    return constant.join(", ");
  }

  // No constant properties — just show count
  return `${variantNames.length} combinations`;
}

// Group a list of components by page → component set
function groupByPageAndComponent(items) {
  const groups = new Map();
  for (const item of items) {
    const { page, componentSet } = parsePath(item.path);
    if (!groups.has(page)) groups.set(page, new Map());
    const pageGroup = groups.get(page);
    if (!pageGroup.has(componentSet)) pageGroup.set(componentSet, []);
    pageGroup.get(componentSet).push(item);
  }
  return groups;
}

function generateReport(comparison, mainName, branchName) {
  const { added, removed, modified, renamed, unchanged } = comparison;
  const lines = [];

  // Header
  lines.push(`# Component Comparison Report`);
  lines.push(``);
  lines.push(`| | |`);
  lines.push(`| --- | --- |`);
  lines.push(`| **Main file** | ${mainName} |`);
  lines.push(`| **Branch** | ${branchName} |`);
  lines.push(`| **Date** | ${new Date().toISOString().split("T")[0]} |`);
  lines.push(``);

  // Summary
  lines.push(`## Summary`);
  lines.push(``);
  lines.push(`| Status | Count |`);
  lines.push(`| --- | ---: |`);
  lines.push(`| Added | ${added.length} |`);
  lines.push(`| Removed | ${removed.length} |`);
  lines.push(`| Renamed / Moved | ${renamed.length} |`);
  lines.push(`| Modified | ${modified.length} |`);
  lines.push(`| Unchanged | ${unchanged.length} |`);
  lines.push(
    `| **Total (main)** | **${removed.length + modified.length + renamed.length + unchanged.length}** |`,
  );
  lines.push(
    `| **Total (branch)** | **${added.length + modified.length + renamed.length + unchanged.length}** |`,
  );
  lines.push(``);

  // Renamed / Moved components
  if (renamed.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Renamed / Moved Components (${renamed.length})`);
    lines.push(``);

    const renamedGrouped = groupByPageAndComponent(
      renamed.map((r) => ({
        ...r.main,
        changes: r.changes,
        branchPath: r.branch.path,
      })),
    );

    for (const [page, components] of renamedGrouped) {
      lines.push(`### ${page}`);
      lines.push(``);
      lines.push(`| Component | Change | Before | After |`);
      lines.push(`| --- | --- | --- | --- |`);

      for (const [compName, items] of components) {
        for (const item of items) {
          for (const change of item.changes) {
            const from = Array.isArray(change.from)
              ? change.from.join(", ")
              : String(change.from);
            const to = Array.isArray(change.to)
              ? change.to.join(", ")
              : String(change.to);
            lines.push(`| ${item.name} | ${change.field} | ${from} | ${to} |`);
          }
        }
      }
      lines.push(``);
    }
  }

  // Modified components
  if (modified.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Modified Components (${modified.length})`);
    lines.push(``);

    const modGrouped = groupByPageAndComponent(
      modified.map((m) => ({ ...m.main, changes: m.changes })),
    );

    for (const [page, components] of modGrouped) {
      lines.push(`### ${page}`);
      lines.push(``);
      lines.push(`| Component | Change | Details |`);
      lines.push(`| --- | --- | --- |`);

      for (const [, items] of components) {
        for (const item of items) {
          const propChanges = item.changes.filter(
            (c) => c.field !== "addedVariants" && c.field !== "removedVariants",
          );
          const addedVars = item.changes.find(
            (c) => c.field === "addedVariants",
          );
          const removedVars = item.changes.find(
            (c) => c.field === "removedVariants",
          );

          for (const change of propChanges) {
            const from = Array.isArray(change.from)
              ? change.from.join(", ")
              : String(change.from);
            const to = Array.isArray(change.to)
              ? change.to.join(", ")
              : String(change.to);
            lines.push(`| ${item.name} | ${change.field} | ${from} → ${to} |`);
          }

          if (addedVars) {
            const diffSummary = summarizeVariantDiffs(addedVars.to);
            lines.push(
              `| ${item.name} | +${addedVars.to.length} new variants | ${diffSummary} |`,
            );
          }

          if (removedVars) {
            const diffSummary = summarizeVariantDiffs(removedVars.from);
            lines.push(
              `| ${item.name} | -${removedVars.from.length} removed variants | ${diffSummary} |`,
            );
          }
        }
      }
      lines.push(``);
    }
  }

  // Added components — grouped by page, then by component set with variant count
  if (added.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Added Components (${added.length})`);
    lines.push(``);

    const addedGrouped = groupByPageAndComponent(added);

    for (const [page, components] of addedGrouped) {
      lines.push(`### ${page}`);
      lines.push(``);
      lines.push(`| Component | Type | Variants / Children |`);
      lines.push(`| --- | --- | ---: |`);

      for (const [compName, items] of components) {
        const sets = items.filter((i) => i.type === "COMPONENT_SET");
        const variants = items.filter((i) => i.type === "COMPONENT");

        if (sets.length > 0) {
          for (const s of sets) {
            lines.push(
              `| **${s.name}** | COMPONENT_SET | ${s.variantCount ?? s.childCount} variants |`,
            );
          }
        }
        if (variants.length > 0) {
          // Group variants under their parent component set name
          lines.push(
            `| ${compName} | COMPONENT | ${variants.length} variant${variants.length > 1 ? "s" : ""} |`,
          );
        }
      }
      lines.push(``);
    }
  }

  // Removed components — grouped the same way
  if (removed.length > 0) {
    lines.push(`---`);
    lines.push(``);
    lines.push(`## Removed Components (${removed.length})`);
    lines.push(``);

    const removedGrouped = groupByPageAndComponent(removed);

    for (const [page, components] of removedGrouped) {
      lines.push(`### ${page}`);
      lines.push(``);
      lines.push(`| Component | Type | Variants / Children |`);
      lines.push(`| --- | --- | ---: |`);

      for (const [compName, items] of components) {
        const sets = items.filter((i) => i.type === "COMPONENT_SET");
        const variants = items.filter((i) => i.type === "COMPONENT");

        if (sets.length > 0) {
          for (const s of sets) {
            lines.push(
              `| **${s.name}** | COMPONENT_SET | ${s.variantCount ?? s.childCount} variants |`,
            );
          }
        }
        if (variants.length > 0) {
          lines.push(
            `| ${compName} | COMPONENT | ${variants.length} variant${variants.length > 1 ? "s" : ""} |`,
          );
        }
      }
      lines.push(``);
    }
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  if (!FIGMA_TOKEN) {
    console.error("FIGMA_TOKEN not found in .env");
    process.exit(1);
  }

  const prompt = createPrompt();

  try {
    // Step 1: Choose library
    console.log("\nWhich library do you want to review?\n");
    const libraryKeys = Object.keys(LIBRARIES);
    libraryKeys.forEach((key, i) => {
      console.log(`  ${i + 1}. ${LIBRARIES[key].name} (${key})`);
    });
    console.log(`  ${libraryKeys.length + 1}. Custom library`);
    console.log("");

    const choice = await prompt.ask("Enter number: ");
    const choiceIndex = parseInt(choice, 10) - 1;

    if (choiceIndex < 0 || choiceIndex > libraryKeys.length) {
      console.error("Invalid choice.");
      process.exit(1);
    }

    let library;
    if (choiceIndex === libraryKeys.length) {
      // Custom library
      const customInput = await prompt.ask(
        "Enter main library file key or Figma URL: ",
      );
      const customKey = extractFileKey(customInput);
      library = { name: "Custom", fileKey: customKey };
    } else {
      library = LIBRARIES[libraryKeys[choiceIndex]];
    }
    console.log(`\nSelected: ${library.name}\n`);

    // Step 2: Get branch file key or URL
    const branchInput = await prompt.ask(
      "Enter branch file key or Figma URL: ",
    );
    const branchKey = extractFileKey(branchInput);

    if (branchKey === library.fileKey) {
      console.error(
        "\nError: The branch key is the same as the main file key. " +
          "Make sure you're pasting the branch URL/key, not the main file.",
      );
      process.exit(1);
    }

    console.log(`\nBranch file key: ${branchKey}`);

    prompt.close();

    // Step 3: Fetch both files
    console.log("\nFetching main file...");
    const mainFile = await fetchFigmaFile(library.fileKey);
    const mainName = mainFile.name;

    console.log("Fetching branch file...");
    const branchFile = await fetchFigmaFile(branchKey);
    const branchName = branchFile.name;

    // Step 4: Extract components
    console.log("\nExtracting components from main...");
    const mainComponents = extractComponents(mainFile.document);
    console.log(`  Found ${mainComponents.size} components`);

    console.log("Extracting components from branch...");
    const branchComponents = extractComponents(branchFile.document);
    console.log(`  Found ${branchComponents.size} components`);

    // Step 5: Compare (by node ID)
    console.log("\nComparing...");
    const comparison = compareComponents(mainComponents, branchComponents);

    // Step 6: Generate reports
    const report = generateReport(comparison, mainName, branchName);

    const jsonOutput = {
      meta: {
        mainFileKey: library.fileKey,
        branchKey,
        mainName,
        branchName,
        library: library.name,
        date: new Date().toISOString(),
        mainComponentCount: mainComponents.size,
        branchComponentCount: branchComponents.size,
      },
      summary: {
        added: comparison.added.length,
        removed: comparison.removed.length,
        renamed: comparison.renamed.length,
        modified: comparison.modified.length,
        unchanged: comparison.unchanged.length,
      },
      added: comparison.added,
      removed: comparison.removed,
      renamed: comparison.renamed.map((r) => ({
        name: r.main.name,
        path: r.main.path,
        changes: r.changes,
      })),
      modified: comparison.modified.map((m) => ({
        name: m.main.name,
        path: m.main.path,
        changes: m.changes,
      })),
    };

    // Write outputs
    const outputDir = resolve(__dirname, "./reports");
    mkdirSync(outputDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const jsonPath = resolve(outputDir, `component-diff-${timestamp}.json`);
    const mdPath = resolve(outputDir, `component-diff-${timestamp}.md`);

    writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));
    writeFileSync(mdPath, report);

    console.log(`\nDone!`);
    console.log(`  Added:     ${comparison.added.length}`);
    console.log(`  Removed:   ${comparison.removed.length}`);
    console.log(`  Renamed:   ${comparison.renamed.length}`);
    console.log(`  Modified:  ${comparison.modified.length}`);
    console.log(`  Unchanged: ${comparison.unchanged.length}`);
    console.log(`\nReports saved to:`);
    console.log(`  JSON:     ${jsonPath}`);
    console.log(`  Markdown: ${mdPath}`);
  } catch (err) {
    prompt.close();
    throw err;
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
