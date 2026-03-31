import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SocialProof from "@/components/SocialProof";

describe("SocialProof Component", () => {
  it("renders honest feature descriptions", () => {
    render(<SocialProof />);

    expect(screen.getByText("自動更新")).toBeInTheDocument();
    expect(screen.getByText(/6ジャンル/)).toBeInTheDocument();
    expect(screen.getByText("FANZA公式データ連携")).toBeInTheDocument();
  });

  it("does NOT contain fake viewer counts", () => {
    render(<SocialProof />);

    expect(screen.queryByText(/人が閲覧中/)).not.toBeInTheDocument();
    expect(screen.queryByText(/件購入/)).not.toBeInTheDocument();
    expect(screen.queryByText(/人が利用/)).not.toBeInTheDocument();
  });
});
