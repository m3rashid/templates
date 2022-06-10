import React from "react";
import { Layout } from "../components/layout";
import { useByeQuery } from "../generated/graphql";

interface IProps {}

export const Bye: React.FC<IProps> = () => {
  const { data, loading, error } = useByeQuery();
  if (error) {
    console.error(error);
  }

  return (
    <Layout>
      <>
        {loading ? (
          <div>Loading</div>
        ) : error ? (
          <div>An Error Occured</div>
        ) : !data ? (
          <div>No data Found</div>
        ) : (
          <div>{data.bye}</div>
        )}
      </>
    </Layout>
  );
};
