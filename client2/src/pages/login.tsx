import { FormEvent, useState } from "react";
import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { signIn } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn(username.trim(), password);
      navigate("/", { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not sign you in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to NeuroNote"
      description="Pick up where your next idea begins."
      footer={
        <>
          New to NeuroNote? <RouterLink to="/register">Create an account</RouterLink>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            autoComplete="username"
            id="username"
            name="username"
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Your username"
            value={username}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            type="password"
            value={password}
          />
        </FormControl>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <Button
          className="auth-submit"
          isLoading={isSubmitting}
          loadingText="Signing in"
          type="submit"
          width="100%"
        >
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
