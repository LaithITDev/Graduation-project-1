import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Stack,
  useColorMode,
  Image,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AuthSession, clearSession, readSession } from "../utils/auth";

export default function Nav() {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const [session, setSession] = useState<AuthSession | null>(() => readSession());

  function handleLogout() {
    clearSession();
    setSession(null);
    navigate("/login");
  }

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <Box as={RouterLink} to="/" display="flex" alignItems="center">
            <Image
              src={colorMode === "light" ? "/logo-black.svg" : "/logo-white.svg"}
              alt="NeuroNote home"
              height="36px"
              width="150px"
              objectFit="contain"
            />
          </Box>

          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <Button
                aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
                onClick={toggleColorMode}
                variant="ghost"
              >
                {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              </Button>

              <Button as={RouterLink} to="/feedback" colorScheme="teal" variant="outline">
                Feedback
              </Button>

              <Button as={RouterLink} to="/diary" colorScheme="teal" variant="outline">
                Diary
              </Button>

              {session ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    aria-label={`Account menu for ${session.user.username}`}
                    rounded="full"
                    variant="ghost"
                    minW={0}
                  >
                    <Avatar size="sm" name={session.user.username} />
                  </MenuButton>
                  <MenuList>
                    <MenuItem isDisabled>{session.user.username}</MenuItem>
                    <MenuItem onClick={handleLogout}>Log out</MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <>
                  <Button as={RouterLink} to="/login" variant="ghost">
                    Sign in
                  </Button>
                  <Button as={RouterLink} to="/register" colorScheme="teal">
                    Create account
                  </Button>
                </>
              )}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
