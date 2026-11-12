import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

function renderAuthPage(page: ReactNode) {
  return render(
    <ChakraProvider>
      <MemoryRouter>{page}</MemoryRouter>
    </ChakraProvider>
  );
}

test("renders the sign-in form and registration link", () => {
  renderAuthPage(<Login />);

  expect(screen.getByRole("heading", { name: "Sign in to NeuroNote" })).toBeInTheDocument();
  expect(screen.getByLabelText(/Username/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Create an account" })).toHaveAttribute(
    "href",
    "/register"
  );
});

test("renders the registration form", () => {
  renderAuthPage(<Register />);

  expect(screen.getByRole("heading", { name: "Create your account" })).toBeInTheDocument();
  expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Confirm password/)).toBeInTheDocument();
});
