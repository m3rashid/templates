import React from "react";
import { useForm, useToggle } from "@mantine/hooks";
import { Button, Group, Modal, TextInput, PasswordInput } from "@mantine/core";
import { useLoginMutation, useRegisterMutation } from "../generated/graphql";
import { setAccessToken } from "../utils/tokens";

interface IProps {}

export const AuthModal: React.FC<IProps> = () => {
  const [open, setOpen] = React.useState(false);
  const [value, toggle] = useToggle("Login", ["Login", "Register"]);
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();

  const handleAuth = async (values: { email: string; password: string }) => {
    const { email, password } = values;
    const variables = { email, password };

    if (value === "Login") {
      const response = await login({ variables });
      if (response && response.data) {
        console.log(response);
        setAccessToken(response.data.login.accessToken);
      }
    } else if (value === "Register") {
      await register({ variables });
      setTimeout(() => window.location.reload(), 500);
    }
    form.reset();
    setOpen(false);
  };

  return (
    <>
      <Modal
        opened={open}
        onClose={() => setOpen(false)}
        title={`${value} here`}
      >
        <form onSubmit={form.onSubmit(handleAuth)}>
          <TextInput
            required
            mb={12}
            label="Email"
            description="Please use a valid email"
            placeholder="Enter your Email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            required
            mb={24}
            label="Password"
            description="Please use a strong password"
            placeholder="Enter your Password"
            {...form.getInputProps("password")}
          />
          <Button type="submit">{value}</Button>
          <Button ml={12} variant="subtle" onClick={() => toggle()}>
            {value === "Login" ? "Register instead" : "Login Instead"}
          </Button>
        </form>
      </Modal>
      <Group position="center">
        <Button mb={12} onClick={() => setOpen(true)}>
          Login or Register
        </Button>
      </Group>
    </>
  );
};
