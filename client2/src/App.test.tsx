import { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
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

test("redirects visitors from the home page to registration", async () => {
  localStorage.clear();
  render(
    <ChakraProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <h1>Home</h1>
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </MemoryRouter>
    </ChakraProvider>
  );

  expect(
    await screen.findByRole("heading", { name: "Create your account" })
  ).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Home" })).not.toBeInTheDocument();
});

test("allows a signed-in visitor to access protected pages", async () => {
  const originalFetch = global.fetch;
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({ id: 1, username: "laith", email: "laith@example.com" }),
  } as Response);
  global.fetch = fetchMock as typeof fetch;
  localStorage.setItem(
    "neuronnote.session",
    JSON.stringify({
      token: "test-token",
      user: { id: 1, username: "laith", email: "laith@example.com" },
    })
  );

  const { unmount } = render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <h1>Home</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

  try {
    expect(screen.getByRole("status")).toHaveTextContent("Checking your session");
    expect(
      await screen.findByRole("heading", { name: "Home" })
    ).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      })
    );
  } finally {
    unmount();
    global.fetch = originalFetch;
    localStorage.clear();
  }
});
