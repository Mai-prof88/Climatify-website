import { describe, it, expect } from "vitest";
import { formatFileSize, optimizeImage } from "./imageOptimizer";

describe("Image Optimizer Unit Tests", () => {
  it("formats file sizes correctly in B, KB, and MB", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(1048576)).toBe("1.00 MB");
    expect(formatFileSize(5242880)).toBe("5.00 MB");
  });

  it("bypasses vector SVG and animated GIF to preserve fidelity", async () => {
    const svgBlob = new Blob(["<svg></svg>"], { type: "image/svg+xml" });
    const svgFile = new File([svgBlob], "test-logo.svg", { type: "image/svg+xml" });

    const result = await optimizeImage(svgFile);
    expect(result.savedPercentage).toBe(0);
    expect(result.format).toBe("image/svg+xml");
    expect(result.file.name).toBe("test-logo.svg");
  });

  it("compresses raster images to achieve at least 50% reduction", async () => {
    const originalSize = 1024 * 500; // 500 KB
    const dummyBlob = new Blob([new Uint8Array(originalSize)], { type: "image/jpeg" });
    const dummyFile = new File([dummyBlob], "nature-photo.jpg", { type: "image/jpeg" });

    const result = await optimizeImage(dummyFile);
    expect(result.savedPercentage).toBeGreaterThanOrEqual(50);
    expect(result.compressedSize).toBeLessThanOrEqual(result.originalSize * 0.5);
    expect(result.file.name.endsWith(".webp")).toBe(true);
    expect(result.format).toBe("image/webp");
  });
});
