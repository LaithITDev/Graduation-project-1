import { FormEvent, useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { signUp } from "../utils/auth";

export default function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accessibilityNeed, setAccessibilityNeed] = useState("Prefer not to say");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Your passwords do not match.");
            return;
        }

        setIsSubmitting(true);
        try {
            await signUp({
                username: username.trim(),
                email: email.trim(),
                password,
                disablility_type: accessibilityNeed,
            });
            navigate("/", { replace: true });
        } catch (requestError) {
            setError(
                requestError instanceof Error
                    ? requestError.message
                    : "We could not create your account. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <AuthLayout
            eyebrow="Start your journey"
            title="Create your account"
            description="A few details, then you can get straight to making music."
            footer={
                <>
                    Already have an account? <RouterLink to="/login">Sign in</RouterLink>
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
                        placeholder="Choose a username"
                        value={username}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        autoComplete="email"
                        id="email"
                        name="email"
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        type="email"
                        value={email}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                        autoComplete="new-password"
                        id="password"
                        name="password"
                        minLength={8}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a password"
                        type="password"
                        value={password}
                    />
                </FormControl>
                <FormControl isRequired>
                    <FormLabel htmlFor="confirm-password">Confirm password</FormLabel>
                    <Input
                        autoComplete="new-password"
                        id="confirm-password"
                        name="confirm-password"
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Enter your password again"
                        type="password"
                        value={confirmPassword}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="accessibility-need">
                        Accessibility preference
                    </FormLabel>
                    <Select
                        id="accessibility-need"
                        name="accessibility-need"
                        onChange={(event) => setAccessibilityNeed(event.target.value)}
                        value={accessibilityNeed}
                    >
                        <option>Prefer not to say</option>
                        <option>No specific accommodation</option>
                        <option>Visual</option>
                        <option>Hearing</option>
                        <option>Motor</option>
                        <option>Cognitive</option>
                    </Select>
                </FormControl>
                {error && (
                    <p className="auth-error" role="alert">
                        {error}
                    </p>
                )}
                <Button
                    className="auth-submit"
                    isLoading={isSubmitting}
                    loadingText="Creating account"
                    type="submit"
                    width="100%"
                >
                    Create account
                </Button>
            </form>
        </AuthLayout>
    );
}