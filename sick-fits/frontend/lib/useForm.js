import { useState } from 'react';

export default function useForm(initial = {}) {
  // create state object for our inputs
  const [inputs, setInputs] = useState(initial);

  // {
  //   name: 'bird',
  //   description: 'nice stuff'/,
  //   price: 100
  // }

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }
  // return the things we want to sruface from the custom hook
  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
