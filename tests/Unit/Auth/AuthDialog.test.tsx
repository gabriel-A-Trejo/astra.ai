import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthDialog from "@/components/auth/AuthDialog";
import "@testing-library/jest-dom";

// Mock external dependencies
jest.mock("@kinde-oss/kinde-auth-nextjs/components", () => ({
  RegisterLink: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("../header/Logo", () => () => <div data-testid="logo">Logo</div>);

describe("AuthDialog", () => {
  const closeDialogMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when open", () => {
    render(<AuthDialog openDialog={true} closeDialog={closeDialogMock} />);

    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Sign in to unlock the full potential of AI-powered development/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  });

  it("calls closeDialog when dialog is closed", () => {
    render(<AuthDialog openDialog={true} closeDialog={closeDialogMock} />);

    // Simulate clicking outside or closing (Dialog will trigger onOpenChange)
    fireEvent.click(screen.getByRole("dialog").parentElement!);

    expect(closeDialogMock).toHaveBeenCalled();
  });
});
