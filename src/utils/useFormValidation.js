import React, {useState, useEffect} from 'react';


const useFormValidation = (initialState, validate, authenticate) => {
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setSubmitting] = useState(false);

    useEffect(() => {
        if(isSubmitting) {
          const noErrors = Object.keys(errors).length === 0;
          if(noErrors) {
            // console.log('authenticated', values );
            authenticate();
            setSubmitting(false);
          } else {
            setSubmitting(false);
          }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [errors]);

    const handleChange = (event) => {
    event.persist();
    setValues(prevState => ({
      ...prevState,
      [event.target.name]: event.target.value
    }))
    };

    const handleBlur = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    };
    

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setSubmitting(true);
    // console.log({values});
  };

    return { handleSubmit, handleChange, values, handleBlur, errors, isSubmitting }
};

export default useFormValidation;