import { gql, useMutation } from '@apollo/client';
import Form from './styles/Form';
import useForm from '../lib/useForm';
// import { CURRENT_USER_QUERY } from './User';
import DisplayError from './ErrorMessage';

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
      sendUserPasswordResetLink(email: $email) {
        code
        message
      }
    }
  `;

  const [resetPassword, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
      // refetchQueries: [{ query: CURRENT_USER_QUERY }], // need to refetch the query for the nav to change
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    const res = await resetPassword().catch(console.error);
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
      <h2>Request a Password Reset</h2>
      <DisplayError error={error} />
      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Success! Check your email for a link</p>
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
        <button type="submit">Request Reset!</button>
      </fieldset>
    </Form>
  );
}
