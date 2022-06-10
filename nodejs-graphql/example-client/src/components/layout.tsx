import React from "react";
import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  Navbar,
  useMantineTheme,
} from "@mantine/core";

import { AuthModal } from "./auth.modal";
import { Link } from "react-router-dom";

interface IProps {
  children?: React.ReactChild;
}

export const Layout: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = React.useState(true);
  const [opened, setOpened] = React.useState(false);
  const theme = useMantineTheme();

  React.useEffect(() => {
    fetch("http://localhost:5000/refresh-token", {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      <AppShell
        navbarOffsetBreakpoint="sm"
        fixed
        navbar={
          <Navbar
            p="md"
            hiddenBreakpoint="sm"
            hidden={!opened}
            width={{ sm: 300, lg: 400 }}
          >
            <Link to="/">Home</Link>
            <Link to="/bye">Bye</Link>
          </Navbar>
        }
        header={
          <Header height={70} p="md">
            <div
              style={{ display: "flex", alignItems: "center", height: "100%" }}
            >
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <AuthModal />
            </div>
          </Header>
        }
      >
        {loading ? <div>Loading</div> : children}
      </AppShell>
    </>
  );
};
