import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
// import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });

  const RESET_MUTATION = gql`
    mutation RESET_MUTATION(
      $email: String!
      $token: String!
      $password: String!
    ) {
      redeemUserPasswordResetToken(
        email: $email
        token: $token
        password: $password
      ) {
        code
        message
      }
    }
  `;

  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  const successfulError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await reset().catch(console.error);
    console.log(res);
    console.log({ data, loading, error });
    resetForm();
    // send email& passowrd to the GrapghQL API
  }

  return (
    // don't normally need to add post method,
    // but if you don't and use the input type of password
    // if something is broken in Javascript then the passworrd
    // could end up on query string :(.
    // Annoying security issue:
    // this means its the browser history
    // and its in your logs...

    <Form method="post" onSubmit={handleSubmit}>
      {console.log({ error })}
      <h2>Reset Your Password</h2>
      <DisplayError error={error || successfulError} />
      <fieldset>
        {data?.redeemUserPasswordResetToken === null && (
          <p>Success! You can Now sign in</p>
        )}
        <label htmlFor="email">
          Email
          <input
            name="email"
            type="email"
            placeholder="You Email address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Reset!</button>
      </fieldset>
    </Form>
  );
}
