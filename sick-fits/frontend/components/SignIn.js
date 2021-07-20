import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

export default function SignIn() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  const SIGNIN_MUTRATION = gql`
    mutation SIGNIN_MUTRATION($email: String!, $password: String!) {
      authenticateUserWithPassword(email: $email, password: $password) {
        ... on UserAuthenticationWithPasswordSuccess {
          item {
            name
            email
          }
        }
        ... on UserAuthenticationWithPasswordFailure {
          code
          message
        }
      }
    }
  `;

  const [signin, { data, loading }] = useMutation(SIGNIN_MUTRATION, {
    variables: inputs,
    // refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }], // need to refetch the query for the nav to change
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // send email& passowrd to the GrapghQL API
    const res = await signin();
    console.log(res);
    resetForm();
  }

  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data?.authenticateUserWithPassword
      : undefined;

  return (
    // don't normally need to add post method,
    // but if you don't and use the input type of passord
    // if something is broken in Javascript then the pasowrd
    // could end up on query string :(.
    // Annoying security issue:
    // this means its the browser history
    // and its in your logs...

    <Form method="post" onSubmit={handleSubmit}>
      <h2>Sign Into Your Account</h2>
      <DisplayError error={error} />
      <fieldset>
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
        <label htmlFor="email">
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
        <button type="submit">Sign In!</button>
      </fieldset>
    </Form>
  );
}
