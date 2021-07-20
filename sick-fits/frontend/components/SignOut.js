import { gql, useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const SIGNOUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function SignOut() {
  const [signout] = useMutation(SIGNOUT_MUTATION, {
    variables: {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    },
  });

  return (
    <button type="button" onClick={signout}>
      Sign Out
    </button>
  );
}
