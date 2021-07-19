import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # which vars are passed in and their what type are they?
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      id
      price
      description
      name
    }
  }
`;

export default function CreateProduct() {
  const { inputs, handleChange, clearForm, resetForm } = useForm({
    image: '',
    name: 'Nice shoes',
    price: 3453,
    description: 'The best shoes',
  });
  const [createProduct, { loading, error, data }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      variables: inputs,
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }], // This is the network way: refetch the products after the mutation has run successfullys
    }
  );
  console.log(createProduct);

  // just showing the two ways of hooking up the onSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    // submit input fields to the backend
    const res = await createProduct(); // could also pass in the inputs here. In this example, it was preloaded on line 42 since the inputs were know (this is generally the preferred way)
    // console.log('data: ', data);
    clearForm();
    // go to the products page
    Router.push({
      pathname: `/product/${res.data.createProduct.id}`,
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      // onSubmit={async (e) => {
      //   e.preventDefault();
      //   console.log(inputs);
      //   // submit input fields to the backend
      //   await createProduct();
      //   clearForm();
      // }}
    >
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        Image
        <label htmlFor="image">
          <input
            required
            type="file"
            id="image"
            name="image"
            onChange={handleChange}
          />
        </label>
        Name
        <label htmlFor="name">
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">+ Add Product</button>
      </fieldset>
    </Form>
  );
}
