import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthDialog from "@/components/auth/AuthDialog";
import "@testing-library/jest-dom";

// Define an interface for the mock props
interface MockRegisterLinkProps {
  children: React.ReactNode;
  authUrlParams?: { connection_id?: string };
  [key: string]: any; // Allow other props
}

// Mock external dependencies using the interface
const mockRegisterLink = jest.fn((props: MockRegisterLinkProps) => {
  const { children, authUrlParams, ...rest } = props; // Destructure authUrlParams
  return <div {...rest}>{children}</div>; // authUrlParams is not passed to div
});

jest.mock("@kinde-oss/kinde-auth-nextjs/components", () => ({
  RegisterLink: (props: MockRegisterLinkProps) => mockRegisterLink(props),
}));

// Original Logo mock using JSX
jest.mock("../../../components/header/Logo", () => () => (
  <div data-testid="logo">Logo</div>
));

describe("AuthDialog", () => {
  const closeDialogMock = jest.fn();
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_KINDE_CONNECTION_GOOGLE: "test_google_connection_id",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

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
    expect(mockRegisterLink).toHaveBeenCalledWith(
      expect.objectContaining({
        authUrlParams: {
          connection_id: "test_google_connection_id",
        },
      })
    );
  });

  it("does not render when openDialog is false", () => {
    render(<AuthDialog openDialog={false} closeDialog={closeDialogMock} />);

    expect(screen.queryByTestId("logo")).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        /Sign in to unlock the full potential of AI-powered development/i
      )
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Sign in with Google")).not.toBeInTheDocument();
  });

  it("calls closeDialog when dialog is closed", () => {
    const { rerender } = render(
      <AuthDialog openDialog={true} closeDialog={closeDialogMock} />
    );

    // Simulate dialog close by changing openDialog prop
    rerender(<AuthDialog openDialog={false} closeDialog={closeDialogMock} />);

    // Or find a specific close button if one exists
    // const closeButton = screen.getByRole("button", { name: /close/i });
    // fireEvent.click(closeButton);

    expect(closeDialogMock).toHaveBeenCalled();
  });
});
