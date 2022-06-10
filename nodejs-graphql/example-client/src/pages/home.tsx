import React from "react";
import { LoadingOverlay, Card, Group, Text, Badge, Title } from "@mantine/core";

import { Layout } from "../components/layout";
import { useUsersQuery } from "../generated/graphql";

interface IProps {}

export const Home: React.FC<IProps> = () => {
  const { data, loading } = useUsersQuery({
    // network-only to make request to the server and not use the cache
    fetchPolicy: "network-only",
  });

  return (
    <>
      <Layout>
        <div style={{ width: "100%", position: "relative" }}>
          <LoadingOverlay transitionDuration={500} visible={loading} />
          <Title mb={12} ml={8}>
            List of users
          </Title>
          {data?.users.map((user) => {
            const { email, id } = user;
            return (
              <Card
                style={{ maxWidth: "400px" }}
                key={id}
                mb={12}
                shadow="sm"
                p="lg"
              >
                <Group position="apart">
                  <Text weight={500}>{email}</Text>
                  <Badge color="pink" variant="light">
                    {id}
                  </Badge>
                </Group>
              </Card>
            );
          })}
          <Title mb={12} ml={8} mt={32}>
            Logged In User
          </Title>
        </div>
      </Layout>
    </>
  );
};
