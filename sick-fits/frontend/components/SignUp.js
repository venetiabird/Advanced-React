import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
// import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

export default function SignUp() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    name: '',
  });

  const SIGNUP_MUTRATION = gql`
    mutation SIGNUP_MUTRATION(
      $email: String!
      $name: String!
      $password: String!
    ) {
      createUser(data: { email: $email, name: $name, password: $password }) {
        id
        name
        email
      }
    }
  `;

  const [signup, { data, loading, error }] = useMutation(SIGNUP_MUTRATION, {
    variables: inputs,
    // refetchQueries: [{ query: CURRENT_USER_QUERY }], // need to refetch the query for the nav to change
  });

  async function handleSubmit(e) {
    e.preventDefault();
    // send email& passowrd to the GrapghQL API
    const res = await signup().catch(console.error);
    console.log(res);
    console.log({ data, loading, error });
    resetForm();
  }

  return (
    // don't normally need to add post method,
    // but if you don't and use the input type of passord
    // if something is broken in Javascript then the pasowrd
    // could end up on query string :(.
    // Annoying security issue:
    // this means its the browser history
    // and its in your logs...

    <Form method="post" onSubmit={handleSubmit}>
      <h2>Sign Up For an Account</h2>
      <DisplayError error={error} />
      <fieldset>
        {data?.createUSer && (
          <p>
            Signed up with {data.createUSer.email}
            Please go ahead and sign in!.
          </p>
        )}
        <label htmlFor="email">
          Your Name
          <input
            name="name"
            type="name"
            placeholder="You Name"
            autoComplete="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
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
